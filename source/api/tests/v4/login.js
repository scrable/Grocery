const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10001;
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
    port: 10001,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:10001';
      await fetch(`${t.context.baseUrl}/v4/register`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          t.context.serialNumber = data.serialNumber;
          t.context.pin = data.pin;
          await fetch(`${t.context.baseUrl}/v4/login`, {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serialNumber: t.context.serialNumber,
              pin: t.context.pin,
            }),
          })
            .then((res2) => res2.json())
            .then((data2) => {
              t.context.session = data2.session;
            });
        });
    });
});

test('/login | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/login`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serialNumber: '1234',
      pin: '',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/login | POST | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/login`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serialNumber: '1234',
      pin: '    ',
    }),
  })
    .then((res) => {
      t.is(res.status, 406);
    });
});

test('/login | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/login`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serialNumber: t.context.serialNumber,
      pin: t.context.pin,
    }),
  })
    .then((res) => {
      t.is(res.status, 200);
      return res.json();
    })
    .then((data) => {
      t.true('session' in data);
      t.is(typeof data.session, 'string');
      t.is(data.session.length, 36);
    });
});
