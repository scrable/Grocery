const mariadb = require('mariadb');
const mariadbOptions = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectionLimit: 5,
};

module.exports = mariadb.createPool(mariadbOptions);
