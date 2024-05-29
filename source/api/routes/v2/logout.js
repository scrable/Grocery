const express = require('express');
const logout = express.Router();

const pool = require('../../database.js');
let connection;

logout.post('/', async (req, res) => {
  try {
    connection = await pool.getConnection();
    let sql = 'SELECT count(*) FROM v2_fridges WHERE pin=' + [req.body.pin] + ' AND serial_number=' + [req.body.serial_number];
    let sql2 = 'DELETE FROM v2_sessions WHERE pin=' + [req.body.pin] + ' AND serial_number=' + [req.body.serial_number];
    // let sql = 'INSERT INTO v2_sessions (session, fridge_id) VALUES(3131, 1)';
    // console.log(sql)
    await connection.query(sql)
      .then(connection.query(sql2))
      .then((results) => res.send(JSON.stringify(results)).end())
      // res.json(results).end();
      .catch((error) => {
        console.log(error)
        res.sendStatus(400).end();
      });
  } catch (error) {
    console.log(error)
    res.sendStatus(401).end();
  }
  finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = logout;
