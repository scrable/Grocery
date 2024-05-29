const express = require('express');
const ingredients = express.Router();
const fetch = require('node-fetch');

const pool = require('../../database.js');
let connection;

/**
 * GET /v3/ingredients
 * @description Retrieves ingredient information given their IDs.
 * @param {integer(,integer)} ingredientIDs
 * @return {object[]} ingredients
 */
ingredients.get('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.query).length !== 2 || !('session' in req.query) || !('ingredientIDs' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, ingredientIDs;
  try {
    if (typeof req.query.session !== 'string' || typeof req.query.ingredientIDs !== 'string') {
      throw new TypeError();
    }
    session = req.query.session;
    ingredientIDs = req.query.ingredientIDs.split(',').map(value => parseInt(value));
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || ingredientIDs.length === 0 || !ingredientIDs.every(value => !isNaN(value) && value > 0)) {
    res.sendStatus(400).end();
    return;
  }
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT fridge_id FROM v3_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          await connection.query('SELECT ingredient_id AS ingredientID, name, image FROM v3_ingredients WHERE ingredient_id IN (?) ORDER BY ingredient_id', [ingredientIDs.join(', ')])
            .then(async (rows2) => {
              if (rows2.length > 0) {
                res.json(rows2.filter((ingredient, index) => index !== 'meta')).end();
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
 * GET /v3/ingredients/search
 * @description Retrieve ingredients list of current fridges with session.
 * @param {string} session
 * @param {string} query
 * @param {integer} page (optional)
 * @param {integer} limit (optional)
 * @returns {object[]} ingredients
 */
ingredients.get('/search', async (req, res) => {
  // check correct params
  if ((Object.keys(req.query).length === 2 ||
    (Object.keys(req.query).length === 4 && !('page' in req.query && 'limit' in req.query))) &&
    !('session' in req.query && 'query' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, query, page, limit;
  try {
    if (typeof req.query.session !== 'string' || typeof req.query.query !== 'string') {
      throw new TypeError();
    }
    session = req.query.session;
    query = req.query.query;
    page = (req.query.page && parseInt(req.query.page)) || 1;
    limit = (req.query.limit && parseInt(req.query.limit)) || 20;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || query.length === 0 || page <= 0 || limit <= 0) {
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
          // @todo page
          // retrieve for endpoint
          await fetch('https://api.spoonacular.com/food/ingredients/autocomplete?query=' + query + '&number=' + limit + '&metaInformation=true&apiKey=bd1784451bab4f47ac234225bd2549ee', {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error('error ' + res.status);
              }
              return res.json();
            })
            .then((data) => {
              if (data.length > 0) {
                // parse date format
                let results = [];
                data.map((item) => {
                  results.push({
                    ingredientID: item.id,
                    name: item.name,
                    image: item.image,
                  });
                });
                res.json(results).end();
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
 * POST /v3/ingredients
 * @description Insert inventory list of current fridges with session.
 * @param {string} session
 * @param {integer} ingredientID
 * @param {string} name
 * @param {string|null} image
 * @returns {integer} ingredientID
 */
ingredients.post('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.body).length !== 4 || !('session' in req.body && 'ingredientID' in req.body && 'name' in req.body && 'image' in req.body)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, ingredientID, name, image;
  try {
    if (typeof req.body.session !== 'string' || typeof req.body.name !== 'string' || (typeof req.body.image !== 'string' && req.body.image !== null)) {
      throw new TypeError();
    }
    session = req.body.session;
    ingredientID = parseInt(req.body.ingredientID);
    name = req.body.name;
    image = req.body.image;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  // @todo validate image is url
  if (session.length !== 36 || ingredientID <= 0 || name.length === 0 || name.length > 128) {
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
          // insert for endpoint
          await connection.query('INSERT IGNORE INTO v3_ingredients (ingredient_id, name, image) VALUES (?, ?, ?)', [ingredientID, name, image])
            .then(async (results) => {
              if (results.affectedRows > 0) {
                res.json({ ingredientID: ingredientID }).end();
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

module.exports = ingredients;
