export const initialState = {
  name: '',
  servings: '',
  cooking_time: '',
};

export const recipesCreateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RECIPESCREATE_SET_NAME': {
      return {
        ...state,
        name: action.name,
      };
    }
    case 'RECIPESCREATE_SET_SERVINGS': {
      return {
        ...state,
        servings: action.servings,
      };
    }
    case 'RECIPESCREATE_SET_COOKING_TIME': {
      return {
        ...state,
        cooking_time: action.cooking_time,
      };
    }
    default: {
      return state;
    }
  }
};
