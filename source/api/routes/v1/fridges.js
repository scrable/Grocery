const express = require('express');
const fridges = express.Router();

const pool = require('../../database.js');
let connection;

//fridges

fridges.get('/', async (req, res) => {
  if (Object.keys(req.query).length > 0) { // TODO: need to check contains either begin & limit
    res.sendStatus(400).end();
  }
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT fridge_id FROM fridges')
      .then((results) => {
        res.json(results).end();
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

fridges.post('/', async (req, res) => {
  try {
    connection = await pool.getConnection();
    await connection.query('INSERT INTO fridges VALUES (?)', req.body.fridge_id)
    .then((results) => {
      res.json(results).end();
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

//console.log('fridges.stack');
//console.log(fridges.stack);

module.exports = fridges;
