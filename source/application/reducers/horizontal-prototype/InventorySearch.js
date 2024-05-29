export const initialState = {
  searchOpen: true,
  keywords: '',
  autoComplete: [],
};

export const inventorySearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INVENTORYSEARCH_SET_SEARCHOPEN': {
      return {
        ...state,
        searchOpen: action.searchOpen,
      };
    }
    case 'INVENTORYSEARCH_SET_KEYWORDS': {
      return {
        ...state,
        keywords: action.keywords,
      };
    }
    case 'INVENTORYSEARCH_SET_AUTOCOMPLETE': {
      return {
        ...state,
        autoComplete: action.autoComplete,
      };
    }
    default: {
      return state;
    }
  }
};
