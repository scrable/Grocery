const express = require('express');
const inventory = express.Router();

const pool = require('../../database.js');
let connection;

const {
  selectInventory,
  insertInventoryLog,
  insertInventory,
  updateInventory,
} = require('./functions/inventory.js');

/**
 * GET /v4/inventory
 * @description Retreive information about a specific inventory item.
 * @param {string} session
 * @param {integer} inventoryID
 * @return {object}
 */
inventory.get('/', async (req, res) => {
  // check param types
  const session = req.query.session;
  const inventoryID = Number.parseInt(req.query.inventoryID, 10);
  if (typeof session !== 'string' || Number.isNaN(inventoryID) || session.length !== 36
    || inventoryID < 0) {
    res.sendStatus(400).end();
    return;
  }
  try {
    connection = await pool.getConnection();
    connection.query('SELECT 1 FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          connection.query('SELECT ingredient_id as ingredientID, expiration_date as expirationDate, total_quantity as totalQuantity, unit, price FROM v4_inventory WHERE inventory_id=?', [inventoryID])
            .then((rows2) => {
              if (rows2.length > 0) {
                const item = rows2[0];
                connection.query('SELECT user_id as userID, quantity, unit, action, action_ts as actionTS FROM v4_inventory_log WHERE inventory_id=? ORDER BY action_ts DESC', [inventoryID])
                  .then(async (rows3) => {
                    item.history = rows3.filter((_, index) => index !== 'meta');
                    res.json(item).end();
                  });
              } else {
                res.sendStatus(406).end();
              }
            });
        } else {
          res.sendStatus(401).end();
        }
      });
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release(); // release to pool
    }
  }
});

/**
 * GET /v4/inventory/list:state
 * @description Retrieve inventory list of current fridges with session.
 * @param {string} session
 * @param {integer} page (optional)
 * @param {integer} limit (optional)
 * @param {string} sort (optional)
 * @param {boolean} descending (optional)
 * @returns {object[]} inventory
 */
inventory.get('/list/:state', async (req, res) => {
  // check correct ':state'
  const state = req.params.state;
  if (!['all', 'stored', 'expired'].includes(state)) {
    res.sendStatus(400).end();
    return;
  }
  // check correct params
  if ((Object.keys(req.query).length == 1 ||
    (Object.keys(req.query).length == 3 && !('page' in req.query && 'limit' in req.query)) ||
    (Object.keys(req.query).length == 5 && !('page' in req.query && 'limit' in req.query && 'sort' in req.query && 'descending' in req.query))) &&
    !('session' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, page, limit, sort, descending;
  try {
    if (typeof req.query.session !== 'string' || (req.query.sort && typeof req.query.sort !== 'string')) {
      throw new TypeError();
    }
    session = req.query.session;
    page = (req.query.page && parseInt(req.query.page)) || 1;
    limit = (req.query.limit && parseInt(req.query.limit)) || 100;
    sort = req.query.sort || null;
    descending = (req.query.descending && (req.query.descending == true || (req.query.descending == false && false))) || null;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || page <= 0 || limit <= 0 || (sort != null && !['expiration_date'].includes(sort))) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          // retrieve for endpoint
          selectInventory(connection, fridgeID, null, state, page, limit, sort, descending)
            .then((rows) => {
              if (rows.length > 0) {
                res.json(rows.filter((_, index) => index !== 'meta')).end();
              } else {
                res.sendStatus(406).end();
              }
            });
        } else {
          res.sendStatus(401).end();
        }
      });
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release(); // release to pool
    }
  }
});

/**
 * POST /v4/inventory/add/manual
 * @description Insert inventory for current fridges with session.
 * @param {string} session
 * @param {integer} userID
 * @param {integer} ingredientID
 * @param {timestamp|null} expirationDate
 * @param {float} totalQuantity
 * @param {string} unit
 * @param {integer} price
 * @returns {interger} inventoryID
 */
inventory.post('/add/manual', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length == 7 && !('session' in req.body && 'userID' in req.body && 'ingredientID' in req.body && 'expirationDate' in req.body && 'totalQuantity' in req.body && 'unit' in req.body && 'price' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, userID, ingredientID, expirationDate, totalQuantity, unit, price;
  try {
    if (typeof req.body.session !== 'string' || typeof req.body.unit !== 'string') {
      throw new TypeError();
    }
    session = req.body.session;
    userID = parseInt(req.body.userID);
    ingredientID = parseInt(req.body.ingredientID);
    expirationDate = (req.body.expirationDate && parseInt(req.body.expirationDate)) || null;
    totalQuantity = parseFloat(req.body.totalQuantity);
    unit = req.body.unit;
    price = parseInt(req.body.price);
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  // @todo unit valid values
  if (session.length !== 36 || userID <= 0 || ingredientID <= 0 || totalQuantity <= 0.0 || unit.length === 0 || unit.length > 8 || price < 0) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          // insert for endpoint
          insertInventory(connection, fridgeID, ingredientID, expirationDate, totalQuantity, unit, price)
            .then((results) => {
              if (results.affectedRows > 0) {
                insertInventoryLog(connection, results.insertId, userID, totalQuantity, unit, 'added')
                  .then((results2) => {
                    if (results2.affectedRows > 0) {
                      res.json({ inventoryID: results.insertId }).end();
                    } else {
                      res.sendStatus(400).end();
                    }
                  });
              } else {
                res.sendStatus(400).end();
              }
            });
        } else {
          res.sendStatus(401).end();
        }
      });
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release(); // release to pool
    }
  }
});

/**
 * POST /v4/inventory/consume
 * @description Insert inventory log of consume for current fridges with session.
 * @param {string} session
 * @param {integer} userID
 * @param {integer} inventoryID
 * @param {float} quantity
 * @param {string} unit
 */
inventory.post('/consume', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length == 5 && !('session' in req.body && 'userID' in req.body && 'inventoryID' in req.body && 'quantity' in req.body && 'unit' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, userID, inventoryID, quantity, unit;
  try {
    if (typeof req.body.session !== 'string' || typeof req.body.unit !== 'string') {
      throw new TypeError();
    }
    session = req.body.session;
    userID = parseInt(req.body.userID);
    inventoryID = parseInt(req.body.inventoryID);
    quantity = parseFloat(req.body.quantity);
    unit = req.body.unit;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  // @todo unit valid values
  if (session.length !== 36 || userID <= 0 || inventoryID <= 0 || quantity <= 0.0 || unit.length === 0 || unit.length > 8) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    connection.query('SELECT 1 FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          // @todo unit conversion
          // insert for endpoint
          updateInventory(connection, inventoryID, quantity)
            .then((results) => {
              if (results.affectedRows > 0) {
                insertInventoryLog(connection, inventoryID, userID, quantity, unit, 'consumed')
                  .then((results2) => {
                    if (results2.affectedRows > 0) {
                      res.sendStatus(200).end();
                    } else {
                      res.sendStatus(406).end();
                    }
                  });
              } else {
                res.sendStatus(400).end();
              }
            });
        } else {
          res.sendStatus(401).end();
        }
      });
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release(); // release to pool
    }
  }
});

/**
 * POST /v4/inventory/discard
 * @description Insert inventory log of discard for current fridges with session.
 * @param {string} session
 * @param {integer} userID
 * @param {integer} inventoryID
 * @param {float} quantity
 * @param {string} unit
 */
inventory.post('/discard', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length == 5 && !('session' in req.body && 'userID' in req.body && 'inventoryID' in req.body && 'quantity' in req.body && 'unit' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, userID, inventoryID, quantity, unit;
  try {
    if (typeof req.body.session !== 'string' || typeof req.body.unit !== 'string') {
      throw new TypeError();
    }
    session = req.body.session;
    userID = parseInt(req.body.userID);
    inventoryID = parseInt(req.body.inventoryID);
    quantity = parseFloat(req.body.quantity);
    unit = req.body.unit;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  // @todo unit valid values
  if (session.length !== 36 || userID <= 0 || inventoryID <= 0 || quantity <= 0.0 || unit.length === 0 || unit.length > 8) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    connection.query('SELECT 1 FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          // @todo unit conversion
          // insert for endpoint
          updateInventory(connection, inventoryID, quantity)
            .then((results) => {
              if (results.affectedRows > 0) {
                insertInventoryLog(connection, inventoryID, userID, quantity, unit, 'discarded')
                  .then((results2) => {
                    if (results2.affectedRows > 0) {
                      res.sendStatus(200).end();
                    } else {
                      res.sendStatus(406).end();
                    }
                  });
              } else {
                res.sendStatus(400).end();
              }
            });
        } else {
          res.sendStatus(401).end();
        }
      });
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release(); // release to pool
    }
  }
});

module.exports = inventory;
