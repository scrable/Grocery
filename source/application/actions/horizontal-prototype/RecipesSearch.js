export const setSearchOpen = (searchOpen) => ({
  type: 'RECIPESSEARCH_SET_SEARCHOPEN',
  searchOpen: searchOpen,
});

export const setKeywords = (keywords) => ({
  type: 'RECIPESSEARCH_SET_KEYWORDS',
  keywords: keywords,
});

export const setCaloriesFilter = (caloriesFilter) => ({
  type: 'RECIPESSEARCH_SET_CALORIESFILTER',
  caloriesFilter: caloriesFilter,
});

export const setServingsFilter = (servingsFilter) => ({
  type: 'RECIPESSEARCH_SET_SERVINGSFILTER',
  servingsFilter: servingsFilter,
});

export const setFatFilter = (fatFilter) => ({
  type: 'RECIPESSEARCH_SET_FATFILTER',
  fatFilter: fatFilter,
});

export const setProteinFilter = (proteinFilter) => ({
  type: 'RECIPESSEARCH_SET_PROTEINFILTER',
  proteinFilter: proteinFilter,
});

export const setCarbonhydratesFilter = (carbonhydratesFilter) => ({
  type: 'RECIPESSEARCH_SET_CALORIESFILTER',
  carbonhydratesFilter: carbonhydratesFilter,
});

export const setAutoComplete = (autoComplete) => ({
  type: 'RECIPESSEARCH_SET_AUTOCOMPLETE',
  autoComplete: autoComplete,
});
