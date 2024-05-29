const express = require('express');
const fridges = express.Router();

const pool = require('../../database.js');
let connection;

/**
 * POST /v2/fridges
 * @description Creates a new fridge and yields its serial number and pin.
 * @returns {string} The serial number.
 */
fridges.post('/', async (req, res) => {
  try {
    const generate = (n) => Array(n).fill().map(() => Math.floor(10 * Math.random())).join(''); // @todo is there a better way?
    let serialNumber;
    let results;
    const pin = generate(4);
    connection = await pool.getConnection();
    do {
      results = await connection.query('SELECT 1 FROM v2_fridges WHERE serial_number=?', [serialNumber = generate(10)]);
    } while (results.length > 0);
    await connection.query('INSERT INTO v2_fridges (serial_number, pin) VALUES (?, ?)', [serialNumber, pin]);
    res.send(JSON.stringify({ serialNumber: serialNumber, pin: pin })).end();
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = fridges;
