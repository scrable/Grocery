export const setPlannedTS = (plannedTS) => ({
  type: 'MEALPLANSVIEW_SET_PLANNEDTS',
  plannedTS: plannedTS,
});

export const setMealPlans = (mealPlans) => ({
  type: 'MEALPLANSVIEW_SET_MEALPLANS',
  mealPlans: mealPlans,
});

export const setDialogOpen = (dialogOpen) => ({
  type: 'MEALPLANSVIEW_SET_DIALOGOPEN',
  dialogOpen: dialogOpen,
});
