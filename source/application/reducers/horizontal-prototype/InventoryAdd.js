export const initialState = {
  searchOpen: true,
  dialogOpen: false,
  keywords: '',
  autoComplete: [],
  ingredientID: null,
  quantity: 1.0,
  unit: '',
  price: 0,
  expirationDate: '',
};

export const inventoryAddReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INVENTORYADD_SET_SEARCHOPEN': {
      return {
        ...state,
        searchOpen: action.searchOpen,
      };
    }
    case 'INVENTORYADD_SET_DIALOGOPEN': {
      return {
        ...state,
        dialogOpen: action.dialogOpen,
      };
    }
    case 'INVENTORYADD_SET_KEYWORDS': {
      return {
        ...state,
        keywords: action.keywords,
      };
    }
    case 'INVENTORYADD_SET_AUTOCOMPLETE': {
      return {
        ...state,
        autoComplete: action.autoComplete,
      };
    }
    case 'INVENTORYADD_SET_INGREDIENTID': {
      return {
        ...state,
        ingredientID: action.ingredientID,
      };
    }
    case 'INVENTORYADD_SET_QUANTITY': {
      return {
        ...state,
        quantity: action.quantity,
      };
    }
    case 'INVENTORYADD_SET_UNIT': {
      return {
        ...state,
        unit: action.unit,
      };
    }
    case 'INVENTORYADD_SET_PRICE': {
      return {
        ...state,
        price: action.price,
      };
    }
    case 'INVENTORYADD_SET_EXPIRATIONDATE': {
      return {
        ...state,
        expirationDate: action.expirationDate,
      };
    }
    default: {
      return state;
    }
  }
};
