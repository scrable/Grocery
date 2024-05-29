const initialState = {
  loggedIn: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        loggedIn: action.trueFalse,
      };
    }
    default: {
      return state;
    }
  }
};
