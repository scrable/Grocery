const selectIngredients = async (connection, ingredientIDs, page, limit) => {
  let sql = 'SELECT ingredient_id AS ingredientID, name, image FROM v4_ingredients WHERE (';
  ingredientIDs.forEach((_, index) => {
    if (index > 0) {
      sql += ' OR ';
    }
    sql += 'ingredient_id=?';
  });
  sql += ') ORDER BY ingredient_id ASC LIMIT ? OFFSET ?';
  return connection.query(sql, [...ingredientIDs, limit, (page - 1) * limit]);
};

const insertIngredient = async (connection, ingredientID, name, image) => {
  return connection.query('INSERT IGNORE INTO v4_ingredients (ingredient_id, name, image) VALUES (?, ?, ?)', [ingredientID, name, image]);
};

const importIngredients = async (connection, ingredients) => {
  if (ingredients.length > 0) {
    let ingredientIDs = ingredients.map((item) => item.ingredientID);
    // remove existing
    let sql = 'SELECT DISTINCT ingredient_id AS ingredientID FROM v4_ingredients WHERE ';
    ingredientIDs.forEach((_, index) => {
      if (index > 0) {
        sql += ' OR ';
      }
      sql += 'ingredient_id=?';
    });
    await connection.query(sql, [...ingredientIDs])
      .then((rows) => {
        if (rows.length > 0) {
          rows.forEach((ingredient, index) => {
            if (index !== 'meta') {
              ingredientIDs = ingredientIDs.filter((item) => item !== ingredient.ingredientID);
            }
          });
        }
      });
    if (ingredientIDs.length > 0) {
      await Promise.all(ingredients.map(async (item) => {
        if (ingredientIDs.includes(item.ingredientID)) {
          await insertIngredient(
            connection,
            item.ingredientID,
            item.name,
            item.image,
          );
        }
        return item;
      }));
    }
  }
};

module.exports = {
  selectIngredients,
  insertIngredient,
  importIngredients,
};
