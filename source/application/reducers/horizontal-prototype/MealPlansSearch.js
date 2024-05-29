export const initialState = {
  searchOpen: true,
  mealPlanID: null,
  keywords: '',
  caloriesFilter: [],
  servingsFilter: [],
  fatFilter: [],
  proteinFilter: [],
  carbonhydrates: [],
  autoComplete: [],
};

export const mealPlansSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MEALPLANSSEARCH_SET_SEARCHOPEN': {
      return {
        ...state,
        searchOpen: action.searchOpen,
      };
    }
    case 'MEALPLANSSEARCH_SET_MEALPLANID': {
      return {
        ...state,
        mealPlanID: action.mealPlanID,
      };
    }
    case 'MEALPLANSSEARCH_SET_KEYWORDS': {
      return {
        ...state,
        keywords: action.keywords,
      };
    }
    case 'MEALPLANSSEARCH_SET_CALORIESFILTER': {
      return {
        ...state,
        caloriesFilter: action.caloriesFilter,
      };
    }
    case 'MEALPLANSSEARCH_SET_SERVINGSFILTER': {
      return {
        ...state,
        servingsFilter: action.servingsFilter,
      };
    }
    case 'MEALPLANSSEARCH_SET_FATFILTER': {
      return {
        ...state,
        fatFilter: action.fatFilter,
      };
    }
    case 'MEALPLANSSEARCH_SET_PROTEINFILTER': {
      return {
        ...state,
        proteinFilter: action.proteinFilter,
      };
    }
    case 'MEALPLANSSEARCH_SET_CARBONHYDRATESFILTER': {
      return {
        ...state,
        carbonhydratesFilter: action.carbonhydratesFilter,
      };
    }
    case 'MEALPLANSSEARCH_SET_AUTOCOMPLETE': {
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
