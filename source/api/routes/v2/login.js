const express = require('express');
const { v4: uuidv4 } = require('uuid');
const login = express.Router();

const pool = require('../../database.js');
let connection;

/**
 * POST /v2/login
 * @description
 * @param {string} serialNumber
 * @param {string} pin
 */
login.post('/', async (req, res) => {
  if (!('serialNumber' in req.body && 'pin' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT fridge_id FROM v2_fridges WHERE serial_number=? AND pin=?', [req.body.serialNumber, req.body.pin])
      .then(async rows => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          const session = uuid.v4();
          const results = (await connection.query('SELECT CURRENT_TIMESTAMP as logged_in_ts, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 MONTH) as expires_ts'))[0];
          await connection.query('INSERT INTO v2_sessions(session, fridge_id, logged_in_ts, expires_ts) VALUES (?, ?, ?, ?)', [session, fridgeID, results.logged_in_ts, results.expires_ts]);
          res.send({ ...results, session: session }).end();
        } else {
          res.sendStatus(404).end();
        }
      })
      .catch(error => {
      throw error;
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500).end();
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
    let sql = 'SELECT * FROM v2_sessions';
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
    let sql = 'DELETE FROM v2_sessions';
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
