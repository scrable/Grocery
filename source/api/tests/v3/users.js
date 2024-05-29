const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10003;
    const compression = require('compression');
    const cors = require('cors');
    app.use(express.json());
    app.use(compression());
    app.use(cors());
    app.use('/v3', require('../../routes/v3/index.js'));
    http.createServer(app).listen(httpPort);
  } catch (error) {
    t.log(error);
  }
  await waitPort({
    host: 'localhost',
    port: 10003,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:10003';
      await fetch(`${t.context.baseUrl}/v3/register`, {
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
          await fetch(`${t.context.baseUrl}/v3/login`, {
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

test('/users | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users?session=abcd`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/users | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users?session=123456789012345678901234567890123456`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/users | GET | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/register`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/login`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serialNumber: data.serialNumber,
          pin: data.pin,
        }),
      })
        .then((res2) => res2.json())
        .then(async (data2) => {
          await fetch(`${t.context.baseUrl}/v3/users?session=${data2.session}`, {
            method: 'get',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((res3) => {
              t.is(res3.status, 406);
            });
        });
    });
});

test('/users | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      role: 'Parent',
      intolerances: [],
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/users?session=${t.context.session}`, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res2) => {
          t.is(res2.status, 200);
          return res2.json();
        })
        .then((data2) => {
          t.true(data2.length >= 1);
          t.is(Object.keys(data2[0]).length, 5);
          t.true('userID' in data2[0]);
          t.true('name' in data2[0]);
          t.true('role' in data2[0]);
          t.true('intolerances' in data2[0]);
          t.true('createdTS' in data2[0]);
          t.is(typeof data2[0].userID, 'number');
          t.is(typeof data2[0].name, 'string');
          t.is(typeof data2[0].role, 'string');
          t.is(typeof data2[0].intolerances, 'string');
          t.is(typeof data2[0].createdTS, 'string');
        });
    });
});

test('/users | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      role: 'Parent',
      intolerances: [],
      session: 'abcd',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/users | POST | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      role: 'Parent',
      intolerances: [],
      session: '123456789012345678901234567890123456',
    }),
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/users | POST | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Donald',
      role: 'Parent',
      intolerances: ['dairy'],
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/users`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Donald',
          role: 'Parent',
          intolerances: ['dairy'],
          session: t.context.session,
        }),
      })
        .then((res2) => {
          t.is(res2.status, 406);
        });
    });
});

test('/users | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Siddhita',
      role: 'Student',
      intolerances: ['seafood'],
      session: t.context.session,
    }),
  })
    .then((res) => {
      t.is(res.status, 200);
      return res.json();
    })
    .then((data) => {
      t.is(Object.keys(data).length, 1);
      t.true('userID' in data);
      t.is(typeof data.userID, 'number');
    });
});

test('/users | DELETE | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Jane Doe',
      role: 'Student',
      intolerances: ['seafood'],
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/users/${data.userID}?session=abcd`, {
        method: 'delete',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res2) => {
          t.is(res2.status, 400);
        });
    });
});

test('/users | DELETE | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users/1?session=123456789012345678901234567890123456`, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/users | DELETE | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users/10000?session=${t.context.session}`, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      t.is(res.status, 406);
    });
});

test('/users | DELETE | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/users`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Cassidy',
      role: 'Student',
      intolerances: ['seafood'],
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/users/${data.userID}?session=${t.context.session}`, {
        method: 'delete',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res2) => {
          t.is(res2.status, 200);
        });
    });
});
