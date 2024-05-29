const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10002;
    const compression = require('compression');
    const cors = require('cors');
    app.use(express.json());
    app.use(compression());
    app.use(cors());
    app.use('/v4', require('../../routes/v4/index.js'));
    http.createServer(app).listen(httpPort);
  } catch (error) {
    t.log(error);
  }
  await waitPort({
    host: 'localhost',
    port: 10002,
    output: 'silent',
    timeout: 5,
  })
    .then(() => {
      t.context.baseUrl = 'http://localhost:10002';
    });
});

test('/register | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/register`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      t.is(res.status, 200);
      return res.json();
    })
    .then((data) => {
      t.is(Object.keys(data).length, 2);
      t.true('serialNumber' in data);
      t.true('pin' in data);
      t.is(data.serialNumber.length, 10);
      t.is(data.pin.length, 4);
    });
});
