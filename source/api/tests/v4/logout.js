const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10006;
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
    port: 10006,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:10006';
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

test('/logout | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/logout`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: '1234',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/logout | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/logout`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: t.context.session,
    }),
  })
    .then((res) => {
      t.is(res.status, 200);
    }).then(async (data) => {
      await fetch(`${t.context.baseUrl}/v4/users?session=${t.context.session}`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res2) => {
          t.is(res2.status, 401);
        });
    });
});

test('/logout | POST | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/logout`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: '3411cd17-9b6d-4e7c-9319-9f6bff857efd',
    }),
  })
    .then((res) => {
      t.is(res.status, 406);
    });
});
