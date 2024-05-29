const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 20007;
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
    port: 20007,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:20007';
    });
});

test('/users/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/horizontal-prototype/users/')
    .then((res) => {
      t.is(res.status, 401);
    });
});
