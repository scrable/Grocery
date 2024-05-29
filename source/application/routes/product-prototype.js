const express = require('express');
const fs = require('fs');
const router = express.Router({ mergeParams: true, strict: true });
const handlebars = require('handlebars');

router.get('/', async (req, res) => {
  const raw = fs.readFileSync('./build/product-prototype.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Product prototype',
  });
  res.send(render);
});

module.exports = router;
