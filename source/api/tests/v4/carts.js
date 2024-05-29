const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10005;
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
      port: 10005,
      output: 'silent',
      timeout: 5,
    })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:10005';
      await fetch(t.context.baseUrl + '/v4/register', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.json())
        .then(async (data) => {
          t.context.serialNumber = data.serialNumber;
          t.context.pin = data.pin;
          await fetch(t.context.baseUrl + '/v4/login', {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                serialNumber: t.context.serialNumber,
                pin: t.context.pin,
              }),
            })
            .then((res2) => res2.json())
            .then(async (data2) => {
              t.context.session = data2.session;
              await fetch(t.context.baseUrl + '/v4/users', {
                  method: 'post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    name: 'Sara',
                    role: 'Student',
                    intolerances: [],
                    session: t.context.session,
                  }),
                })
                .then((res3) => {
                  t.is(res3.status, 200);
                  return res3.json();
                })
                .then(async (data3) => {
                  t.context.userID = data3.userID;
                  await fetch(t.context.baseUrl + '/v4/ingredients', {
                      method: 'post',
                      headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        ingredientID: Math.floor(Math.random() * 10000000),
                        name: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                        image: 'image1',
                        session: t.context.session,
                      }),
                    })
                    .then((res4) => res4.json())
                    .then((data4) => {
                      t.context.ingredientID = data4.ingredientID;
                      
                    });
                });
            });
        });
    });
});


test('/carts | GET | 400', async (t) => {
  await fetch(t.context.baseUrl + '/v4/ingredients?session=abcd&userID=1&sort=userID', {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/ | GET | 401', async (t) => {
  await fetch(t.context.baseUrl + '/v4/ingredients?session=123456789012345678901234567890123456&ingredientIDs=12345678', {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/carts | GET | 406', async (t) => {
  await fetch(t.context.baseUrl + '/v4/register', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(t.context.baseUrl + '/v4/login', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serialNumber: data.serialNumber,
            pin: data.pin,
          }),
        })
        .then((res2) => res2.json())
        .then(async (data2) => {
          await fetch(t.context.baseUrl + '/v4/carts?session=' + data2.session + '&userID=' + Math.floor(Math.random() * 10000000), {
              method: 'get',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            })
            .then((res3) => {
              t.is(res3.status, 406);
            });
        });
    });
});

test('/carts | GET | 200', async (t) => {
  await fetch(t.context.baseUrl + '/v4/carts/recipe', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      recipeID: 113995,
      session: t.context.session,
    }),
  })


  await fetch(t.context.baseUrl + '/v4/users', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Siddhita',
        role: 'Student',
        intolerances: ['seafood'],
        session: t.context.session,
      }),
    })


    .then((res) => res.json())
    .then(async (data) => {

      await fetch(t.context.baseUrl + '/v4/carts?session=' + t.context.session + '&userID=1', {
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
        .then((res2) => {
          console.log(t)
          t.is(res2.status, 200);
          return res2.json();
        })
        .then((data2) => {
          t.true(data2.length >= 1);
          // t.is(Object.keys(data2[0]).length, 3);
          t.true('cartID' in data2[0]);
          t.true('userID' in data2[0]);
          t.true('ingredientID' in data2[0]);
          t.true('quantity' in data2[0]);
          t.true('unit' in data2[0]);
          t.true('addedTS' in data2[0]);
          t.is(typeof data2[0].ingredientID, 'number');
          t.is(typeof data2[0].cartID, 'number');
          t.is(typeof data2[0].userID, 'number');
          t.is(typeof data2[0].quantity, 'number');
          t.is(typeof data2[0].unit, 'string');
        });
    });
});


test('/carts/ingredient | POST | 400', async (t) => {
  await fetch(t.context.baseUrl + '/v4/carts/ingredient', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        useriD: 1,
        ingredientID: 10000,
        quantity: 1,
        unit: 'kg',
        session: 'abcd',
      }),
    })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/carts/ingredient | POST | 401', async (t) => {
  await fetch(t.context.baseUrl + '/v4/carts/ingredient', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: 1,
        ingredientID: 10000,
        quantity: 1,
        unit: 'kg',
        session: 'bfc1effd-bb39-41c5-b529-3d6aa35712e6',
      }),
    })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/carts/ingredient | POST | 200', async (t) => {
  console.log(t.context.userID, "USERID HELLO")
  await fetch(t.context.baseUrl + '/v4/carts/ingredient', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredientID: t.context.ingredientID,
        quantity: 1,
        userID: t.context.userID,
        unit: 'kg',
        session: t.context.session,
      }),
    })
    .then((res) => {
      t.is(res.status, 200);
      return res.json();
    })

});



////////


test('/carts/recipe | POST | 400', async (t) => {
  await fetch(t.context.baseUrl + '/v4/carts/recipe', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: t.context.userID,
        recipeID: 113995,
        session: 'abcd',
      }),
    })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/carts/recipe | POST | 401', async (t) => {
  await fetch(t.context.baseUrl + '/v4/carts/recipe', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: t.context.userID,
        recipeID: 113995,
        session: 'bfc1effd-bb39-41c5-b529-3d6aa35712e6',
      }),
    })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/carts/recipe | POST | 200', async (t) => {
  console.log(t.context.userID, "USERID HELLO")
  await fetch(t.context.baseUrl + '/v4/carts/recipe', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: t.context.userID,
          recipeID: 113995,
        session: t.context.session,
      }),
    })
    .then((res) => {
      t.is(res.status, 200);
      return res.json();
    })

});

