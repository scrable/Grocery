const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 20006;
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
    port: 20006,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:20006';
    });
});

test('/meal-plans/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/horizontal-prototype/meal-plans/')
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/meal-plans/view/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/horizontal-prototype/meal-plans/view/')
    .then((res) => {
      t.is(res.status, 401);
    });
});
