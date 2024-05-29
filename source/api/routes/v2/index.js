const express = require('express');
const index = express.Router();

index.get('/', (req, res) => res.sendStatus(401));

index.use('/fridges', require('./fridges.js'));
index.use('/users', require('./users.js'));
index.use('/inventory', require('./inventory.js'));
index.use('/login', require('./login.js'));
index.use('/ingredients', require('./ingredients.js'));
index.use('/logout', require('./logout.js'));

//console.log('index.stack');
//console.log(index.stack);

module.exports = index;
