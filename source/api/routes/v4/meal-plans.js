const express = require('express');
const fetch = require('node-fetch');
const pool = require('../../database.js');
const { validateSession } = require('./functions/index.js');
const { selectInventory } = require('./functions/inventory.js');
const { importRecipes } = require('./functions/recipes.js');
const { selectMealPlans, insertMealPlan, updateMealPlan } = require('./functions/meal-plans.js');

const mealPlans = express.Router();
let connection;

/**
 * PATCH /meal-plans
 * @description Updates an existing meal plan entry.
 * @param {string} session
 * @param {integer} mealPlanID
 * @param {integer} recipeID
 */
mealPlans.patch('/', async (req, res) => {
  const { session } = req.body;
  const mealPlanID = Number.parseInt(req.body.mealPlanID, 10);
  const recipeID = Number.parseInt(req.body.recipeID, 10);
  if (typeof session !== 'string' || session.length !== 36 || Number.isNaN(mealPlanID)
    || mealPlanID <= 0 || Number.isNaN(recipeID) || recipeID <= 0) {
    res.sendStatus(400).end();
    return;
  }
  try {
    connection = await pool.getConnection();
    if (await validateSession(connection, session) !== null) {
      await updateMealPlan(connection, mealPlanID, recipeID)
        .then((rows2) => {
          if (rows2.affectedRows > 0) {
            res.sendStatus(200).end();
          } else {
            res.sendStatus(406).end();
          }
        });
    } else {
      res.sendStatus(401).end();
    }
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * GET /v4/meal-plans
 * @description Returns the mealplan for a specific day (generates one if it doesn't exist).
 * @param {string} session
 * @param {integer} userID
 * @param {integer} plannedTS must be midnight
 * @returns {object[]} mealPlans
 */
mealPlans.get('/', async (req, res) => {
  const { session } = req.query;
  const userID = Number.parseInt(req.query.userID, 10);
  const plannedTS = Number.parseInt(req.query.plannedTS, 10);
  if (typeof session !== 'string' || session.length !== 36 || Number.isNaN(userID)
    || Number.isNaN(plannedTS) || userID <= 0 || plannedTS % (24 * 60 * 60 * 1000) !== 0) {
    res.sendStatus(400).end();
    return;
  }
  try {
    connection = await pool.getConnection();
    const fridgeID = await validateSession(connection, session);
    if (fridgeID !== null) {
      await selectMealPlans(connection, userID, plannedTS)
        .then(async (rows) => {
          if (rows.length > 0) {
            // mealplan already generated, return it
            res.json(rows.filter((_, index) => index !== 'meta')).end();
          } else {
            // generate mealplan by inventory
            await selectInventory(connection, fridgeID, null, 'stored', 1, 5000, null, null)
              .then((rows2) => {
                if (rows2.length > 0) {
                  const ingredientNames = rows2.map((ingredient, index) => {
                    if (index !== 'meta') {
                      return ingredient.name;
                    }
                    return undefined;
                  });
                  fetch(`https://api.spoonacular.com/recipes/findByIngredients/?ingredients=${ingredientNames.join(',')}&number=3&ranking=2&ignorePantry=true&apiKey=bd1784451bab4f47ac234225bd2549ee`, {
                    method: 'get',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  })
                    .then((res2) => {
                      if (!res2.ok) {
                        throw new Error(`error ${res2.status}`);
                      }
                      return res2.json();
                    })
                    .then(async (data) => {
                      if (data.length > 0) {
                        const recipeIDs = data.map((recipe) => recipe.id);
                        if (recipeIDs.length > 0) {
                          await importRecipes(connection, recipeIDs);
                          await Promise.all(recipeIDs.forEach(async (recipeID) => {
                            insertMealPlan(connection, userID, recipeID, plannedTS);
                          }));
                          selectMealPlans(connection, userID, plannedTS)
                            .then((rows3) => {
                              if (rows3.length > 0) {
                                res.json(rows3.filter((_, index) => index !== 'meta')).end();
                              } else {
                                res.sendStatus(406).end();
                              }
                            });
                        }
                      } else {
                        res.sendStatus(406).end();
                      }
                    });
                } else {
                  // @todo generate meal plan without inventory
                  res.sendStatus(406).end();
                }
              });
          }
        });
    } else {
      res.sendStatus(401).end();
    }
  } catch (error) {
    res.sendStatus(500).end();
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = mealPlans;
