const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10004;
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
    port: 10004,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:10004';
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

test('/ingredients | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients?session=abcd&ingredientIDs=12345678`, {
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

test('/ingredients | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients?session=123456789012345678901234567890123456&ingredientIDs=12345678`, {
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

test('/ingredients | GET | 406', async (t) => {
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
          await fetch(`${t.context.baseUrl}/v3/ingredients?session=${data2.session}&ingredientIDs=12345678`, {
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

test('/ingredients | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredientID: Math.floor(Math.random() * 10000000),
      name: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      image: 'image.jpg',
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/ingredients?session=${t.context.session}&ingredientIDs=${data.ingredientID}`, {
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
          t.is(Object.keys(data2[0]).length, 3);
          t.true('ingredientID' in data2[0]);
          t.true('name' in data2[0]);
          t.true('image' in data2[0]);
          t.is(typeof data2[0].ingredientID, 'number');
          t.is(typeof data2[0].name, 'string');
          t.is(typeof data2[0].image, 'string');
        });
    });
});

test('/ingredients/search | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients/search?session=abcd&query=apple`, {
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

test('/ingredients/search | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients/search?session=123456789012345678901234567890123456&query=apple`, {
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

test('/ingredients/search | GET | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients/search?session=${t.context.session}&query=superbug`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      t.is(res.status, 406);
    });
});

test('/ingredients/search | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients/search?session=${t.context.session}&query=apple`, {
    method: 'get',
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
      t.true(data.length >= 1);
      t.is(Object.keys(data[0]).length, 3);
      t.true('ingredientID' in data[0]);
      t.true('name' in data[0]);
      t.true('image' in data[0]);
      t.is(typeof data[0].ingredientID, 'number');
      t.is(typeof data[0].name, 'string');
      t.is(typeof data[0].image, 'string');
    });
});

test('/ingredients | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredientID: 10000,
      name: 'Apple',
      image: 'image.jpg',
      session: 'abcd',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/ingredients | POST | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredientID: 10000,
      name: 'Apple',
      image: 'image.jpg',
      session: '123456789012345678901234567890123456',
    }),
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/ingredients | POST | 406', async (t) => {
  const id = 10000 + (Math.random() * 10000);
  await fetch(`${t.context.baseUrl}/v3/ingredients`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredientID: id,
      name: `${id}`,
      image: 'image.jpg',
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/ingredients`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredientID: id,
          name: `${id}`,
          image: 'image.jpg',
          session: t.context.session,
        }),
      })
        .then((res2) => {
          t.is(res2.status, 406);
        });
    });
});

test('/ingredients | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/ingredients`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ingredientID: Math.floor(Math.random() * 10000000),
      name: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      image: 'image.jpg',
      session: t.context.session,
    }),
  })
    .then((res) => {
      t.is(res.status, 200);
      return res.json();
    })
    .then((data) => {
      t.is(Object.keys(data).length, 1);
      t.true('ingredientID' in data);
      t.is(typeof data.ingredientID, 'number');
    });
});
