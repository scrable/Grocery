export const initialState = {
  searchOpen: true,
  keywords: '',
  caloriesFilter: [],
  servingsFilter: [],
  fatFilter: [],
  proteinFilter: [],
  carbonhydrates: [],
  autoComplete: [],
};

export const recipesSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RECIPESSEARCH_SET_SEARCHOPEN': {
      return {
        ...state,
        searchOpen: action.searchOpen,
      };
    }
    case 'RECIPESSEARCH_SET_KEYWORDS': {
      return {
        ...state,
        keywords: action.keywords,
      };
    }
    case 'RECIPESSEARCH_SET_CALORIESFILTER': {
      return {
        ...state,
        caloriesFilter: action.caloriesFilter,
      };
    }
    case 'RECIPESSEARCH_SET_SERVINGSFILTER': {
      return {
        ...state,
        servingsFilter: action.servingsFilter,
      };
    }
    case 'RECIPESSEARCH_SET_FATFILTER': {
      return {
        ...state,
        fatFilter: action.fatFilter,
      };
    }
    case 'RECIPESSEARCH_SET_PROTEINFILTER': {
      return {
        ...state,
        proteinFilter: action.proteinFilter,
      };
    }
    case 'RECIPESSEARCH_SET_CARBONHYDRATESFILTER': {
      return {
        ...state,
        carbonhydratesFilter: action.carbonhydratesFilter,
      };
    }
    case 'RECIPESSEARCH_SET_AUTOCOMPLETE': {
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
