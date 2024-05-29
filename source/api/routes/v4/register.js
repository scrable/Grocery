const express = require('express');
const register = express.Router();

const pool = require('../../database.js');
let connection;

/**
 * POST /v4/register
 * @description Register a new fridge and yields its serial number and pin.
 * @returns {string} serialNumber
 * @returns {integer} pin
 */
register.post('/', async (req, res) => {
  const generate = (n) => Array(n).fill().map(() => Math.floor(10 * Math.random())).join(''); // @todo is there a better way?
  let serialNumber, results;
  const pin = generate(4);
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    do {
      results = await connection.query('SELECT 1 FROM v4_fridges WHERE serial_number=?', [serialNumber = generate(10)]);
    } while (results.length > 0);
    connection.query('INSERT IGNORE INTO v4_fridges (serial_number, pin) VALUES (?, ?)', [serialNumber, pin])
      .then((results) => {
        if (results.affectedRows > 0) {
          res.json({ serialNumber: serialNumber.toString(), pin: pin.toString() }).end();
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

module.exports = register;
