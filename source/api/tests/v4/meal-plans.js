const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10009;
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
    port: 10009,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:10009';
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
            .then(async (data2) => {
              t.context.session = data2.session;
              await fetch(`${t.context.baseUrl}/v4/users`, {
                method: 'post',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: 'Sara',
                  role: 'Student',
                  intolerances: [],
                  session: t.context.session,
                }),
              })
                .then((res3) => res3.json())
                .then(async (data3) => {
                  t.context.userID = data3.userID;
                  await fetch(`${t.context.baseUrl}/v4/ingredients`, {
                    method: 'post',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ingredientID: Math.floor(Math.random() * 10000000),
                      name: 'agave',
                      image: 'image1',
                      session: t.context.session,
                    }),
                  })
                    .then((res4) => res4.json())
                    .then((data4) => {
                      t.context.ingredientID1 = data4.ingredientID;
                    });
                  await fetch(`${t.context.baseUrl}/v4/ingredients`, {
                    method: 'post',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ingredientID: Math.floor(Math.random() * 10000000),
                      name: 'quick cooking oats',
                      image: 'image1',
                      session: t.context.session,
                    }),
                  })
                    .then((res4) => res4.json())
                    .then((data4) => {
                      t.context.ingredientID2 = data4.ingredientID;
                    });
                });
            });
        });
    });
});

test('/meal-plans | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/meal-plans?session=abcd&userID=1&plannedTS=1589673600`, {
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

test('/meal-plans | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/meal-plans?session=123456789012345678901234567890123456&userID=${t.context.userID}&plannedTS=1589673600000`, {
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

test('/meal-plans | GET | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/meal-plans?session=${t.context.session}&userID=${t.context.userID}&plannedTS=1589673600000`, {
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

test('/meal-plans | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID1,
      totalQuantity: 10,
      unit: 'stedt',
      expirationDate: 1652745600000,
      price: 12,
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async () => {
      await fetch(`${t.context.baseUrl}/v4/meal-plans?session=${t.context.session}&userID=${t.context.userID}&plannedTS=1589673600000`, {
        method: 'get',
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

test('/meal-plans | PATCH | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/meal-plans`, {
    method: 'patch',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: t.context.session,
      mealPlanID: '-1',
      recipeID: '1',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/meal-plans | PATCH | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/meal-plans`, {
    method: 'patch',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: '123456789012345678901234567890123456',
      mealPlanID: '1',
      recipeID: '1',
    }),
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/meal-plans | PATCH | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/meal-plans`, {
    method: 'patch',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: t.context.session,
      mealPlanID: '1',
      recipeID: '1',
    }),
  })
    .then((res) => {
      t.is(res.status, 406);
    });
});

test('/meal-plans | PATCH | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/meal-plans?session=${t.context.session}&userID=${t.context.userID}&plannedTS=1589673600000`, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then(async (data2) => {
      t.context.session = data2.session;
      await fetch(`${t.context.baseUrl}/v4/meal-plans`, {
        method: 'patch',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: t.context.session,
          mealPlanID: data2.mealPlanID,
          recipeID: data2.recipeID,
        }),
      })
        .then((res2) => {
          t.is(res2.status, 200);
        });
    });
});
