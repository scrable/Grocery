const express = require('express');
const carts = express.Router();

const pool = require('../../database.js');
let connection;

/**
 * PATCH /v4/carts
 * @description Updates a cart entry.
 * @param {string} session
 * @param {integer} cartID
 * @param {float} quantity
 * @param {string} unit
 */
carts.patch('/', async (req, res) => {
  const { session, unit } = req.body;
  const cartID = Number.parseInt(req.body.cartID, 10);
  const quantity = Number.parseFloat(req.body.quantity);
  if (typeof session !== 'string' || session.length !== 36 || Number.isNaN(cartID) || cartID < 0
    || Number.isNaN(quantity) || quantity <= 0 || typeof unit !== 'string' || unit.length === 0 || unit.length > 16) {
    res.sendStatus(400).end();
    return;
  }
  try {
    connection = await pool.getConnection();
    const rows = await connection.query('SELECT 1 FROM v4_sessions WHERE session=?', [session]);
    if (rows.length > 0) {
      const results = await connection.query('UPDATE v4_carts SET quantity=?, unit=? WHERE cart_id=?', [quantity, unit, cartID]);
      if (results.affectedRows === 0) {
        res.sendStatus(400).end();
        return;
      }
      res.sendStatus(200).end();
    } else {
      res.sendStatus(401).end();
    }
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * POST /v4/carts/ingredient
 * @description Insert ingredient to carts list of current fridges with session.
 * @param {string} session
 * @param {integer} userID
 * @param {integer} ingredientID
 * @param {float} quantity
 * @param {string|null} unit
 * @returns {integer} cartID
 */
carts.post('/ingredient', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length == 5 && !('session' in req.body && 'userID' in req.body && 'ingredientID' in req.body && 'quantity' in req.body && 'unit' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  let userID, ingredientID, quantity, unit;
  try {
    if (typeof req.body.session !== 'string' || typeof req.body.unit !== 'string') {
      throw new TypeError();
    }
    session = req.body.session;
    userID = parseInt(req.body.userID);
    ingredientID = parseInt(req.body.ingredientID);
    quantity = parseFloat(req.body.quantity);
    unit = req.body.unit;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || userID <= 0 || ingredientID <= 0 || quantity <= 0.0 || unit.length === 0) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    await connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          // insert for endpoint
          await connection.query('INSERT IGNORE INTO v4_carts (fridge_id, user_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?, ?)', [fridgeID, userID, ingredientID, quantity, unit])
            .then((results) => {
              if (results.affectedRows > 0) {
                res.json({ cartID: results.insertId }).end();
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
 * POST /v4/carts/recipe
 * @description Insert ingredients required to make a recipe.
 * @param {string} session
 * @param {integer} userID
 * @param {integer} recipeID
 * @returns {integer(,integer)} cartIDs
 */
carts.post('/recipe', async (req, res) => {
  const session = req.body.session;
  const userID = Number.parseInt(req.body.userID, 10);
  const recipeID = Number.parseInt(req.body.recipeID, 10);
  if (typeof session !== 'string' || session.length !== 36 || Number.isNaN(userID) || userID < 0
    || Number.isNaN(recipeID) || recipeID < 0) {
    res.sendStatus(400).end();
    return;
  }
  try {
    connection = await pool.getConnection();
    const rows = await connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session]);
    if (rows.length > 0) {
      const fridgeID = rows[0].fridge_id;
      // get ingredients required to make recipe
      const rows2 = await connection.query('SELECT ingredient_id AS ingredientID, quantity, unit FROM v4_recipe_ingredients WHERE recipe_id=?', [recipeID]);
      if (rows2.length > 0) {
        const results = await Promise.all(rows2.map(async (ingredient, index) => {
          if (index !== 'meta') {
            const rows = await connection.query('INSERT INTO v4_carts (fridge_id, user_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?, ?)', [fridgeID, userID, ingredient.ingredientID, ingredient.quantity, ingredient.unit]);
            if (rows.affectedRows > 0) {
              return rows.insertId;
            } else {
              throw new Error('could not insert into v4_carts');
            }
          }
          return undefined;
        }));
        res.json(results).end();
      } else {
        res.sendStatus(406).end();
      }
    } else {
      res.sendStatus(401).end();
    }
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * DELETE /v4/carts
 * @description Delete cart for current fridges with session.
 * @param {string} session
 * @param {integer(,integer)} cartIDs
 */
carts.delete('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.query).length !== 2 || !('session' in req.query && 'cartIDs' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, cartIDs;
  try {
    if (typeof req.query.session !== 'string') {
      throw new TypeError();
    }
    session = req.query.session;
    cartIDs = req.query.cartIDs.split(',').map(value => parseInt(value));
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || !cartIDs.every(value => !isNaN(value) && value > 0)) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    await connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          await connection.query('DELETE FROM v4_carts WHERE fridge_id=? AND cart_id IN (?)', [fridgeID, cartIDs.join(',')])
            .then((results) => {
              if (results.affectedRows > 0) {
                res.sendStatus(200).end();
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



carts.get('/', async (req, res) => {
  // check correct params
  if ((Object.keys(req.query).length == 1 ||
      (Object.keys(req.query).length == 3 && !('page' in req.query && 'limit' in req.query)) ||
      (Object.keys(req.query).length == 5 && !('page' in req.query && 'limit' in req.query && 'sort' in req.query && 'descending' in req.query))) &&
    !('session' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, page, limit, sort, descending, userID;
  try {
    if (typeof req.query.session !== 'string' || (req.query.sort && typeof req.query.sort !== 'string')) {
      throw new TypeError();
    }
    session = req.query.session;
    userID = parseInt(req.query.userID);
    page = (req.query.page && parseInt(req.query.page)) || 1;
    limit = (req.query.limit && parseInt(req.query.limit)) || 100;
    sort = req.query.sort || null;
    descending = req.query.descending || null;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || page <= 0 || limit <= 0) {

    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    await connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
         
          const fridgeID = rows[0].fridge_id;
          // retrieve for endpoint
          let sql = 'SELECT cart_id AS cartID, user_id AS userID, ingredient_id AS ingredientID, quantity, unit, added_ts AS addedTS FROM v4_carts WHERE user_id=' + userID;
          switch (sort) {
            case 'userID':
              sql += ' ORDER BY ' + sort;
              if (!descending) {
                sql += ' ASC';
              } else {
                sql += ' DESC';
              }
              break;

            case 'ingredientID':
              sql += ' ORDER BY ' + sort;
              if (!descending) {
                sql += ' ASC';
              } else {
                sql += ' DESC';
              }
              break;

            case 'addedTS':
              sql += ' ORDER BY ' + sort;
              if (!descending) {
                sql += ' ASC';
              } else {
                sql += ' DESC';
              }
              break;
            default:
              break;
          }
          await connection.query(sql + ' LIMIT ? OFFSET ?', [limit, (page - 1) * limit])
            .then((rows) => {
              if (rows.length > 0) {
                console.log(sql, descending);
                // res.send(JSON.stringify(rows)).end();
                res.json(rows.filter((inventory, index) => index !== 'meta')).end();
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

module.exports = carts;
