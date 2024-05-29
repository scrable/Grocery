const express = require('express');
const { v4: uuidv4 } = require('uuid');
const login = express.Router();

const pool = require('../../database.js');
let connection;

/**
 * POST /v3/login
 * @description Create session after finding corresponding fridgeID using serialNumber and PIN.
 * @param {string} serialNumber
 * @param {string} pin
 * @return {string} session
 */
login.post('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length !== 2 || !('serialNumber' in req.body && 'pin' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let serialNumber, pin;
  if (typeof req.body.serialNumber !== 'string' || typeof req.body.pin !== 'string') {
    res.sendStatus(400).end();
    throw new TypeError();
  }
  serialNumber = req.body.serialNumber;
  pin = req.body.pin;
  // check params data range
  if (serialNumber.length === 0 || serialNumber.length > 16 || pin.length === 0 || pin.length > 16) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT fridge_id FROM v3_fridges WHERE serial_number=? AND pin=?', [serialNumber, pin])
      .then(async (rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          const session = uuidv4();
          const results = (await connection.query('SELECT CURRENT_TIMESTAMP as logged_in_ts, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 MONTH) as expires_ts'))[0];
          await connection.query('INSERT IGNORE INTO v3_sessions(session, fridge_id, logged_in_ts, expires_ts) VALUES (?, ?, ?, ?)', [session, fridgeID, results.logged_in_ts, results.expires_ts]);
          res.json({ ...results, session: session }).end();
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

//for testing
login.get('/', async (req, res) => {
  try {
    connection = await pool.getConnection();
    let sql = 'SELECT * FROM v3_sessions';
    await connection.query(sql)
      .then((results) => {
        res.send(JSON.stringify(results)).end();
        // res.json(results).end();
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

//for testing
login.delete('/', async (req, res) => {
  try {
    connection = await pool.getConnection();
    let sql = 'DELETE FROM v3_sessions';
    await connection.query(sql)
      .then((results) => {
        res.send(JSON.stringify(results)).end();
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

module.exports = login;
