export const initialState = {
  serialNumber: '',
  pin: '',
  dialogOpen: false,
  users: [],
};

export const splashReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SPLASH_SET_SERIALNUMBER': {
      return {
        ...state,
        serialNumber: action.serialNumber,
      };
    }
    case 'SPLASH_SET_PIN': {
      return {
        ...state,
        pin: action.pin,
      };
    }
    case 'SPLASH_SET_DIALOGOPEN': {
      return {
        ...state,
        dialogOpen: action.dialogOpen,
      };
    }
    case 'SPLASH_SET_USERS': {
      return {
        ...state,
        users: action.users,
      };
    }
    default: {
      return state;
    }
  }
};
