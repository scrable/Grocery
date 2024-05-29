export const initialState = {
  recipeID: null,
  title: '',
  image: '',
  servings: 0,
  cookingTime: 0,
  instructions: '',
  ingredients: [],
};

export const recipesViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RECIPESVIEW_SET_RECIPEID': {
      return {
        ...state,
        recipeID: action.recipeID,
      };
    }
    case 'RECIPESVIEW_SET_TITLE': {
      return {
        ...state,
        title: action.title,
      };
    }
    case 'RECIPESVIEW_SET_IMAGE': {
      return {
        ...state,
        image: action.image,
      };
    }
    case 'RECIPESVIEW_SET_SERVINGS': {
      return {
        ...state,
        servings: action.servings,
      };
    }
    case 'RECIPESVIEW_SET_COOKINGTIME': {
      return {
        ...state,
        cookingTime: action.cookingTime,
      };
    }
    case 'RECIPESVIEW_SET_INSTRUCTIONS': {
      return {
        ...state,
        instructions: action.instructions,
      };
    }
    case 'RECIPESVIEW_SET_INGREDIENTS': {
      return {
        ...state,
        ingredients: action.ingredients,
      };
    }
    default: {
      return state;
    }
  }
};
