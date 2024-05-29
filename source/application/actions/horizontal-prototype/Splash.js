export const setSerialNumber = (serialNumber) => ({
  type: 'SPLASH_SET_SERIALNUMBER',
  serialNumber: serialNumber,
});

export const setPIN = (pin) => ({
  type: 'SPLASH_SET_PIN',
  pin: pin,
});

export const setDialogOpen = (dialogOpen) => ({
  type: 'SPLASH_SET_DIALOGOPEN',
  dialogOpen: dialogOpen,
});

export const setUsers = (users) => ({
  type: 'SPLASH_SET_USERS',
  users: users,
});
