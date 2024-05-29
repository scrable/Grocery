export const setSearchOpen = (searchOpen) => ({
  type: 'INVENTORYSEARCH_SET_SEARCHOPEN',
  searchOpen: searchOpen,
});

export const setKeywords = (keywords) => ({
  type: 'INVENTORYSEARCH_SET_KEYWORDS',
  keywords: keywords,
});

export const setAutoComplete = (autoComplete) => ({
  type: 'INVENTORYSEARCH_SET_AUTOCOMPLETE',
  autoComplete: autoComplete,
});
