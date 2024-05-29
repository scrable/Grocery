export const setInventoryID = (inventoryID) => ({
  type: 'INVENTORYVIEW_SET_INVENTORYID',
  inventoryID: inventoryID,
});

export const setName = (name) => ({
  type: 'INVENTORYVIEW_SET_NAME',
  name: name,
});

export const setImage = (image) => ({
  type: 'INVENTORYVIEW_SET_IMAGE',
  image: image,
});

export const setTotalQuantity = (totalQuantity) => ({
  type: 'INVENTORYVIEW_SET_TOTALQUANTITY',
  totalQuantity: totalQuantity,
});

export const setUnit = (unit) => ({
  type: 'INVENTORYVIEW_SET_UNIT',
  unit: unit,
});

export const setPrice = (price) => ({
  type: 'INVENTORYVIEW_SET_PRICE',
  price: price,
});

export const setExpirationDate = (expirationDate) => ({
  type: 'INVENTORYVIEW_SET_EXPIRATIONDATE',
  expirationDate: expirationDate,
});

export const setHistory = (history) => ({
  type: 'INVENTORYVIEW_SET_HISTORY',
  history: history,
});

export const setDialogOpen = (dialogOpen) => ({
  type: 'INVENTORYVIEW_SET_DIALOGOPEN',
  dialogOpen: dialogOpen,
});

export const setDialogQuantity = (dialogQuantity) => ({
  type: 'INVENTORYVIEW_SET_DIALOG_QUANTITY',
  dialogQuantity: dialogQuantity,
});

export const setDialogUnit = (dialogUnit) => ({
  type: 'INVENTORYVIEW_SET_DIALOG_UNIT',
  dialogUnit: dialogUnit,
});
