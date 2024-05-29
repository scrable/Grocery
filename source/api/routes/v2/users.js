const express = require('express');
const users = express.Router();

const pool = require('../../database.js');
let connection;

users.get('/', async (req, res) => {
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT * FROM v2_users')
      .then((results) => {
        res.send(JSON.stringify(results)).end();
        // res.json(results).end();
      });
  } catch (error) {
    res.sendStatus(401).end();
    throw error;
  } finally {
    if (connection) {
      connection.release(); // release to pool
    }
  }
});

users.post('/:name', async (req, res) => {
  try {
    connection = await pool.getConnection();
    // sql = 'UPDATE v2_users (name) VALUES (?) WHERE fridge_id=' + req.params.fridge_id;
    // sql = 'UPDATE v2_users SET name=' + req.params.name + ' WHERE fridge_id=' + req.params.fridge_id;
    sql = 'INSERT INTO v2_users (name, fridge_id, role) VALUES(?, ?, ?,?)';
    console.log(req.params)
    await connection.query(sql, [req.params.name, req.body.fridge_id, req.body.role])
      .then((results) => {
        res.send(JSON.stringify(results)).end();
        // res.json(results).end();
      });
  } catch (error) {
    res.sendStatus(401).end();
    throw error;
  } finally {
    if (connection) {
      connection.release(); // release to pool
    }
  }
});

users.delete('/:name', async (req, res) => {
  try {
    connection = await pool.getConnection();
    await connection.query('DELETE FROM v2_users WHERE name=(?)', [req.params.name])
      .then((results) => {
        res.sendStatus(200).end()
      });
  } catch (error) {
    res.sendStatus(404).end();
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = users;
