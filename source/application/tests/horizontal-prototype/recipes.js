const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 20003;
    const compression = require('compression');
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());
    app.use(compression());
    app.enable('strict routing');
    app.use('/horizontal-prototype', require('../../routes/horizontal-prototype.js'));
    app.use(/^\/(.*)\.(?!html|htm)(.+)\/?(?=\/|$)/i, (req, res, next) => {
      req.url = path.basename(req.originalUrl);
      express.static('../../build', staticOptions)(req, res, next);
    });
    http.createServer(app).listen(httpPort);
  } catch (error) {
    t.log(error);
  }
  await waitPort({
    host: 'localhost',
    port: 20003,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:20003';
    });
});

test('/recipes/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/horizontal-prototype/recipes/')
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/recipes/view/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/horizontal-prototype/recipes/view/')
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/recipes/create/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/horizontal-prototype/recipes/create/')
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/recipes/search/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/horizontal-prototype/recipes/search/')
    .then((res) => {
      t.is(res.status, 401);
    });
});
