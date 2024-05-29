const express = require('express');
const recipes = express.Router();
const fetch = require("node-fetch");

const pool = require('../../database.js');
let connection;

const {
  selectRecipes,
  selectFavoritedRecipes,
  selectRecipeIngredients,
  selectRecipeFavorites,
  insertRecipeFavorite,
  deleteRecipeFavorite,
  importRecipes,
} = require('./functions/recipes.js');

/**
 * GET /v4/recipes/search
 * @description Retrieve recipes list of current fridges with session.
 * @param {string} session
 * @param {string} query
 * @param {integer} page (optional)
 * @param {integer} limit (optional)
 * @returns {object[]} recipes
 */
recipes.get('/search', async (req, res) => {
  // check correct params
  if ((Object.keys(req.query).length == 2 ||
    (Object.keys(req.query).length == 4 && !('page' in req.query && 'limit' in req.query))) &&
    !('session' in req.query && 'query' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, query, page, limit;
  try {
    if (typeof req.query.session !== 'string' || (req.query.sort && typeof req.query.sort !== 'string')) {
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
    await connection.query('SELECT 1 FROM v4_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          // retrieve for endpoint
          await fetch('https://api.spoonacular.com/recipes/search?query=' + query + '&number=' + limit + '&apiKey=a71257d9f31f4ee2af88be4615153f31', {
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
            .then(async (data) => {
              if (data.results.length > 0) {
                const recipeIDs = data.results.map((item) => {
                  return item.id;
                });
                await importRecipes(connection, recipeIDs);
                selectRecipes(connection, recipeIDs, page, limit, 'recipe_id', false)
                  .then((rows) => {
                    if (rows.length > 0) {
                      res.json(rows.filter((_, index) => index !== 'meta')).end();
                    } else {
                      res.sendStatus(406).end();
                    }
                  });
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
 * GET /v4/recipes
 * @description Retreives recipe information given their IDs.
 * @param {integer(,integer)} recipeIDs
 * @returns {object[]} recipes
 */
recipes.get('/', async (req, res) => {
  // check correct params
  if (Object.keys(req.query).length !== 2 || !('session' in req.query) || !('recipeIDs' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, recipeIDs;
  try {
    if (typeof req.query.session !== 'string' || typeof req.query.recipeIDs !== 'string') {
      throw new TypeError();
    }
    session = req.query.session;
    recipeIDs = req.query.recipeIDs.split(',').map(value => parseInt(value));
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || recipeIDs.length === 0 || !recipeIDs.every(value => !isNaN(value) && value > 0)) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          selectRecipes(connection, recipeIDs, 1, recipeIDs.length)
            .then(async (rows2) => {
              if (rows2.length > 0) {
                const recipes = await Promise.all(rows2.map(async (recipe, index) => {
                  if (index !== 'meta') {
                    await Promise.all([
                      selectRecipeIngredients(connection, recipe.recipeID)
                        .then((rows3) => {
                          if (rows3.length > 0) {
                            recipe.ingredients = rows3.filter((_, index2) => index2 !== 'meta');
                          }
                        }),
                      selectRecipeFavorites(connection, recipe.recipeID, fridgeID)
                        .then((rows3) => {
                          if (rows3.length > 0) {
                            recipe.favorites = rows3.filter((_, index2) => index2 !== 'meta');
                          }
                        }),
                    ]);
                    return recipe;
                  }
                }));
                res.json(recipes).end();
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
 * POST /v4/recipes/favorite
 * @description Insert favorited recipe for current user.
 * @param {string} session
 * @param {integer} userID
 * @param {integer} recipeID
 */
recipes.post('/favorite', async (req, res) => {
  // check params data type
  let session, userID, recipeID;
  try {
    if (typeof req.body.session !== 'string') {
      throw new TypeError();
    }
    session = req.body.session;
    userID = parseInt(req.body.userID);
    recipeID = parseInt(req.body.recipeID);
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || userID <= 0 || recipeID <= 0) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT 1 FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          insertRecipeFavorite(connection, userID, recipeID)
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
      })
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
 * DELETE /v4/recipes/favorite
 * @description Delete favorited recipe for current user.
 * @param {string} session
 * @param {integer} userID
 * @param {integer} recipeID
 */
recipes.delete('/favorite', async (req, res) => {
  // check params data type
  let session, userID, recipeID;
  try {
    if (typeof req.query.session !== 'string') {
      throw new TypeError();
    }
    session = req.query.session;
    userID = Number.parseInt(req.query.userID, 10);
    recipeID = Number.parseInt(req.query.recipeID, 10);
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || Number.isNaN(userID) || Number.isNaN(recipeID) || userID < 0 || recipeID < 0) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    await connection.query('SELECT 1 FROM v4_sessions WHERE session=?', [session])
      .then((rows) => {
        if (rows.length > 0) {
          deleteRecipeFavorite(connection, userID, recipeID)
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
      })
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
 * GET /v4/recipes/list:state
 * @description Retrieve recipe list of current fridges with session.
 * @param {string} session
 * @param {integer} userID (optional)
 * @param {integer} page (optional)
 * @param {integer} limit (optional)
 * @param {string} sort (optional)
 * @param {boolean} descending (optional)
 * @returns {object[]} recipes
 */
recipes.get('/list/:state', async (req, res) => {
  // check correct ':state'
  const state = req.params.state;
  if (!['all', 'favorited'].includes(state)) {
    res.sendStatus(400).end();
    return;
  }
  // check correct params
  if ((Object.keys(req.query).length == 1 ||
  (Object.keys(req.query).length == 2 && !('userID' in req.query)) ||
  (Object.keys(req.query).length == 3 && !('page' in req.query && 'limit' in req.query)) ||
  (Object.keys(req.query).length == 5 && !('page' in req.query && 'limit' in req.query && 'sort' in req.query && 'descending' in req.query)) ||
  (Object.keys(req.query).length == 4 && !('userID' in req.query && 'page' in req.query && 'limit' in req.query)) ||
  (Object.keys(req.query).length == 6 && !('userID' in req.query && 'page' in req.query && 'limit' in req.query && 'sort' in req.query && 'descending' in req.query))) &&
  !('session' in req.query)) {
    res.sendStatus(400).end();
    return;
  }
  // check params data type
  let session, userID, page, limit, sort, descending;
  try {
    if (typeof req.query.session !== 'string' || (req.query.sort && typeof req.query.sort !== 'string')) {
      throw new TypeError();
    }
    session = req.query.session;
    userID = (req.query.userID && parseInt(req.query.userID)) || null;
    page = (req.query.page && parseInt(req.query.page)) || 1;
    limit = (req.query.limit && parseInt(req.query.limit)) || 100;
    sort = req.query.sort || null;
    descending = (req.query.descending && (req.query.descending == true || (req.query.descending == false && false))) || null;
  } catch (error) {
    res.sendStatus(400).end();
    throw error;
  }
  // check params data range
  if (session.length !== 36 || (userID != null && userID <= 0) || page <= 0 || limit <= 0 || (sort != null && !['recipe_id'].includes(sort))) {
    res.sendStatus(400).end();
    return;
  }
  // run query to mariadb
  try {
    connection = await pool.getConnection();
    // retrieve fridge_id
    await connection.query('SELECT fridge_id FROM v4_sessions WHERE session=?', [session])
      .then(async (rows) => {
        if (rows.length > 0) {
          // @todo handle possible duplicate sessions
          const fridgeID = rows[0].fridge_id;
          // retrieve for endpoint
          let query;
          switch (state) {
            case 'all':
              query = selectRecipes(connection, null, page, limit, sort, descending);
              break;
            case 'favorited':
              query = selectFavoritedRecipes(connection, userID, page, limit, sort, descending);
              break;
          }
          query
            .then((rows) => {
              if (rows.length > 0) {
                res.json(rows.filter((_, index) => index !== 'meta')).end();
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

module.exports = recipes
