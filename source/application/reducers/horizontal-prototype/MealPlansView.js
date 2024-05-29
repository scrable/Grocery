export const initialState = {
  plannedTS: null,
  mealPlans: [],
  dialogOpen: null,
};

export const mealPlansViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MEALPLANSVIEW_SET_PLANNEDTS': {
      return {
        ...state,
        plannedTS: action.plannedTS,
      };
    }
    case 'MEALPLANSVIEW_SET_MEALPLANS': {
      return {
        ...state,
        mealPlans: action.mealPlans,
      };
    }
    case 'MEALPLANSVIEW_SET_DIALOGOPEN': {
      return {
        ...state,
        dialogOpen: action.dialogOpen,
      };
    }
    default: {
      return state;
    }
  }
};
