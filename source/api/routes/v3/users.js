const express = require('express');
const users = express.Router();

const pool = require('../../database.js');
let connection;

/**
 * GET /v3/users
 * @description Retrieve users list of current fridges with session.
 * @param {string} session
 * @returns {object[]} users
 */
users.get('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.query).length !== 1 || !('session' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session;
  if (typeof req.query.session !== 'string') {
    res.sendStatus(400).end();
    throw new TypeError();
  }
  session = req.query.session;
  // check params data range
  if (session.length !== 36) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    await connection.query('SELECT fridge_id FROM v3_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          // retrieve for endpoint
          await connection.query('SELECT user_id AS userID, name, role, intolerances, created_ts AS createdTS FROM v3_users WHERE fridge_id=?', [fridgeID])
            .then((rows2) => {
              if (rows2.length > 0) {
                res.json(rows2.filter((user, index) => index !== 'meta')).end();
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
 * POST /v3/users
 * @description Insert users for current fridges with session.
 * @param {string} session
 * @param {string} name
 * @param {string} role
 * @param {string[]} intolerances
 * @returns {interger} userID
 */
users.post('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length !== 4 || !('session' in req.body && 'name' in req.body && 'role' in req.body && 'intolerances' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, name, role, intolerances;
  if (typeof req.body.session !== 'string' || typeof req.body.name !== 'string' || typeof req.body.role !== 'string' || !Array.isArray(req.body.intolerances)) {
    res.sendStatus(400).end();
    throw new TypeError();
  }
  session = req.body.session;
  name = req.body.name;
  role = req.body.role;
  intolerances = req.body.intolerances;
  // check params data range
  const knownIntolerances = ['dairy', 'egg', 'gluten', 'grain', 'peanut', 'seafood', 'sesame', 'shellfish', 'soy', 'sulfite', 'tree nut', 'wheat'];
  if (session.length !== 36 || name.length < 3 || name.length > 64 || role.length === 0 || role.length > 64 || !intolerances.every((intolerance) => knownIntolerances.includes(intolerance))) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    await connection.query('SELECT fridge_id FROM v3_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          // @todo handle duplicate names
          const fridgeID = rows[0].fridge_id;
          // insert for endpoint
          await connection.query('INSERT IGNORE INTO v3_users (fridge_id, name, role, intolerances) VALUES (?, ?, ?, ?)', [fridgeID, name, role, intolerances.join(',')])
            .then(async (results) => {
              if (results.affectedRows > 0) {
                res.json({ userID: results.insertId }).end();
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
 * DELETE /v3/users/:userID
 * @description Delete user for current fridges with session.
 * @param {string} session
 */
users.delete('/:userID', async (req, res) => {
  // check correct params
  if (Object.keys(req.query).length !== 1 || !('session' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let userID, session;
  try {
    if (typeof req.query.session !== 'string') {
      throw new TypeError();
    }
    userID = parseInt(req.params.userID);
    session = req.query.session;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (userID <= 0 || session.length !== 36) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    await connection.query('SELECT fridge_id FROM v3_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          // insert for endpoint
          await connection.query('DELETE FROM v3_users WHERE user_id=? AND fridge_id=?', [userID, fridgeID])
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

module.exports = users;
