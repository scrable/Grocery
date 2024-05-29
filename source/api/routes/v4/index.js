const express = require('express');
const index = express.Router();

index.get('/', (req, res) => res.sendStatus(401));

index.use('/register', require('./register.js'));
index.use('/login', require('./login.js'));
index.use('/logout', require('./logout.js'));
index.use('/users', require('./users.js'));
index.use('/inventory', require('./inventory.js'));
index.use('/ingredients', require('./ingredients.js'));
index.use('/recipes', require('./recipes.js'));
index.use('/carts', require('./carts.js'));
index.use('/convert', require('./convert.js'));
index.use('/meal-plans', require('./meal-plans.js'));

//console.log('index.stack');
//console.log(index.stack);

module.exports = index;
