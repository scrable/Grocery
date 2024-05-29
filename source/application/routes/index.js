const express = require('express');
const fs = require('fs');
const router = express.Router({ mergeParams: true, strict: true });
//const react = require('react');
//const reactDOMServer = require('react-dom/server');
//const appComponent = require('../components/App.jsx');
const handlebars = require('handlebars');

router.get('/', async (req, res) => {
  const raw = fs.readFileSync('./build/index.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    //root: reactDOMServer.renderToString(appComponent),
  });
  res.send(render);
});

module.exports = router;
