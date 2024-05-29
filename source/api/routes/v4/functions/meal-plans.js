const selectMealPlans = async (connection, userID, plannedTS) => {
  return connection.query('SELECT meal_plan_id AS mealPlanID, user_id AS userID, recipe_id AS recipeID, planned_ts AS plannedTS FROM v4_meal_plans WHERE user_id=? AND planned_ts >= FROM_UNIXTIME(?) AND planned_ts < FROM_UNIXTIME(?)', [userID, plannedTS, plannedTS + 60 * 60 * 24])
};

const insertMealPlan = async (connection, userID, recipeID, plannedTS) => {
  return connection.query('INSERT IGNORE INTO v4_meal_plans (user_id, recipe_id, planned_ts) VALUES (?, ?, ?)', [userID, recipeID, plannedTS]);
};

const updateMealPlan = async (connection, mealPlanID, recipeID) => {
  return connection.query('UPDATE IGNORE v4_meal_plans SET recipe_id=? WHERE meal_plan_id=?', [recipeID, mealPlanID]);
};

module.exports = {
  selectMealPlans,
  insertMealPlan,
  updateMealPlan,
};
