export const initialState = {
  inventoryID: null,
  name: '',
  image: '',
  totalQuantity: 0.0,
  unit: '',
  price: 0,
  expirationDate: '',
  dialogOpen: null,
  dialogQuantity: 0.0,
  dialogUnit: '',
};

export const inventoryViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INVENTORYVIEW_SET_INVENTORYID': {
      return {
        ...state,
        inventoryID: action.inventoryID,
      };
    }
    case 'INVENTORYVIEW_SET_NAME': {
      return {
        ...state,
        name: action.name,
      };
    }
    case 'INVENTORYVIEW_SET_IMAGE': {
      return {
        ...state,
        image: action.image,
      };
    }
    case 'INVENTORYVIEW_SET_TOTALQUANTITY': {
      return {
        ...state,
        totalQuantity: action.totalQuantity,
      };
    }
    case 'INVENTORYVIEW_SET_UNIT': {
      return {
        ...state,
        unit: action.unit,
      };
    }
    case 'INVENTORYVIEW_SET_PRICE': {
      return {
        ...state,
        price: action.price,
      };
    }
    case 'INVENTORYVIEW_SET_EXPIRATIONDATE': {
      return {
        ...state,
        expirationDate: action.expirationDate,
      };
    }
    case 'INVENTORYVIEW_SET_HISTORY': {
      return {
        ...state,
        history: action.history,
      };
    }
    case 'INVENTORYVIEW_SET_DIALOGOPEN': {
      return {
        ...state,
        dialogOpen: action.dialogOpen,
      };
    }
    case 'INVENTORYVIEW_SET_DIALOG_QUANTITY': {
      return {
        ...state,
        dialogQuantity: action.dialogQuantity,
      };
    }
    case 'INVENTORYVIEW_SET_DIALOG_UNIT': {
      return {
        ...state,
        dialogUnit: action.dialogUnit,
      };
    }
    default: {
      return state;
    }
  }
};
