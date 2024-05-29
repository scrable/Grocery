export const setRecipeID = (recipeID) => ({
  type: 'RECIPESVIEW_SET_RECIPEID',
  recipeID: recipeID,
});

export const setTitle = (title) => ({
  type: 'RECIPESVIEW_SET_TITLE',
  title: title,
});

export const setImage = (image) => ({
  type: 'RECIPESVIEW_SET_IMAGE',
  image: image,
});

export const setServings = (servings) => ({
  type: 'RECIPESVIEW_SET_SERVINGS',
  servings: servings,
});

export const setCookingTime = (cookingTime) => ({
  type: 'RECIPESVIEW_SET_COOKINGTIME',
  cookingTime: cookingTime,
});

export const setInstructions = (instructions) => ({
  type: 'RECIPESVIEW_SET_INSTRUCTIONS',
  instructions: instructions,
});

export const setIngredients = (ingredients) => ({
  type: 'RECIPESVIEW_SET_INGREDIENTS',
  ingredients: ingredients,
});
