export const setName = (name) => ({
  type: 'RECIPESCREATE_SET_NAME',
  name: name,
});

export const setServings = (servings) => ({
  type: 'RECIPESCREATE_SET_SERVINGS',
  servings: servings,
});

export const setCookingTime = (cooking_time) => ({
  type: 'RECIPESCREATE_SET_COOKING_TIME',
  cooking_time: cooking_time,
});
