export const setSearchOpen = (searchOpen) => ({
  type: 'MEALPLANSSEARCH_SET_SEARCHOPEN',
  searchOpen: searchOpen,
});

export const setMealPlanID = (mealPlanID) => ({
  type: 'MEALPLANSSEARCH_SET_MEALPLANID',
  mealPlanID: mealPlanID,
});

export const setKeywords = (keywords) => ({
  type: 'MEALPLANSSEARCH_SET_KEYWORDS',
  keywords: keywords,
});

export const setCaloriesFilter = (caloriesFilter) => ({
  type: 'MEALPLANSSEARCH_SET_CALORIESFILTER',
  caloriesFilter: caloriesFilter,
});

export const setServingsFilter = (servingsFilter) => ({
  type: 'MEALPLANSSEARCH_SET_SERVINGSFILTER',
  servingsFilter: servingsFilter,
});

export const setFatFilter = (fatFilter) => ({
  type: 'MEALPLANSSEARCH_SET_FATFILTER',
  fatFilter: fatFilter,
});

export const setProteinFilter = (proteinFilter) => ({
  type: 'MEALPLANSSEARCH_SET_PROTEINFILTER',
  proteinFilter: proteinFilter,
});

export const setCarbonhydratesFilter = (carbonhydratesFilter) => ({
  type: 'MEALPLANSSEARCH_SET_CALORIESFILTER',
  carbonhydratesFilter: carbonhydratesFilter,
});

export const setAutoComplete = (autoComplete) => ({
  type: 'MEALPLANSSEARCH_SET_AUTOCOMPLETE',
  autoComplete: autoComplete,
});
