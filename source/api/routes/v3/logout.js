const express = require('express');
const logout = express.Router();

const pool = require('../../database.js');
let connection;

/**
 * POST /v3/logout
 * @description Delete session to logout.
 * @param {string} session
 */
logout.post('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length !== 1 || !('session' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session;
  if (typeof req.body.session !== 'string') {
    res.sendStatus(400).end();
    throw new TypeError();
  }
  session = req.body.session;
  // check params data range
  if (session.length !== 36) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT 1 FROM v3_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          await connection.query('DELETE FROM v3_sessions WHERE session=?', [session])
            .then((results) => {
              if (results.affectedRows > 0) {
                res.sendStatus(200).end();
              } else {
                res.sendStatus(406).end();
              }
            });
        } else {
          res.sendStatus(406).end();
        }
      });
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = logout;
