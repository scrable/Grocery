let apiUrl = location.protocol + '//' + (process.env.API_HOST || location.hostname);
if (process.env.API_PORT) {
  apiUrl += ':' + process.env.API_PORT;
}

export {
  apiUrl
};
