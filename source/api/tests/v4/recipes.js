const test = require('ava');
const waitPort = require('wait-port');
const fetch = require('node-fetch');

test.before(async (t) => {
  // start test server
  try {
    const express = require('express');
    const http = require('http');
    const app = express();
    const httpPort = 10008;
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
    port: 10008,
    output: 'silent',
    timeout: 5,
  })
    .then(async () => {
      t.context.baseUrl = 'http://localhost:10008';
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
                  await fetch(`${t.context.baseUrl}/v4/recipes/search?session=${t.context.session}&query=salad&page=1&limit=2`,
                    {
                      method: 'get',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    })
                    .then((res4) => {
                      t.is(res4.status, 200);
                      return res4.json();
                    })
                    .then((data4) => {
                      t.context.recipeID1 = data4[0].recipeID;
                      t.context.recipeID2 = data4[1].recipeID;
                    });
                });
            });
        });
    });
});

test('/recipes/search | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/search?session=abcd&query=blah&page=1&limit=50`, {
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

test('/recipes/search | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/search?session=123456789012345678901234567890123456&query=blah&page=1&limit=50`, {
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

test('/recipes/search | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/search?session=${t.context.session}&query=salad&page=1&limit=1`, {
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
      t.is(Object.keys(data[0]).length, 6);
      t.true('recipeID' in data[0]);
      t.true('title' in data[0]);
      t.true('image' in data[0]);
      t.true('servings' in data[0]);
      t.true('cookingTime' in data[0]);
      t.true('instructions' in data[0]);
      t.is(typeof data[0].recipeID, 'number');
      t.is(typeof data[0].title, 'string');
      t.is(typeof data[0].image, 'string');
      t.is(typeof data[0].servings, 'number');
      t.is(typeof data[0].cookingTime, 'number');
      t.is(typeof data[0].instructions, 'string');
    });
});

test('/recipes | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes?session=abcd&recipeIDs=12345678`, {
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

test('/recipes | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes?session=123456789012345678901234567890123456&recipeIDs=1`, {
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

test('/recipes | GET | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/register`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v4/login`, {
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
          await fetch(`${t.context.baseUrl}/v4/recipes?session=${data2.session}&recipeIDs=1`, {
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

test('/recipes | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes?session=${t.context.session}&recipeIDs=${t.context.recipeID1}`, {
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

test('/recipes/favorite | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipeID: 10000,
      userID: 1,
      session: 'abcd',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/recipes/favorite | POST | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipeID: 10000,
      userID: 1,
      session: '123456789012345678901234567890123456',
    }),
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/recipes/favorite | POST | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipeID: 10000,
      userID: 1,
      session: t.context.session,
    }),
  })
    .then((res) => {
      t.is(res.status, 406);
    });
});

test('/recipes/favorite | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipeID: t.context.recipeID1,
      userID: t.context.userID,
      session: t.context.session,
    }),
  })
    .then((res) => {
      t.is(res.status, 200);
    });
});

test('/recipes/favorite | DELETE | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite?session=abcd&userID=1`, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/recipes/favorite | DELETE | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite?session=123456789012345678901234567890123456&userID=1&recipeID=1`, {
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

test('/recipes/favorite | DELETE | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite?session=${t.context.session}&userID=1&recipeID=1`, {
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

test('/recipes/favorite | DELETE | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v4/recipes/favorite`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipeID: t.context.recipeID2,
      userID: t.context.userID,
      session: t.context.session,
    }),
  })
    .then(async (res) => {
      await fetch(`${t.context.baseUrl}/v4/recipes/favorite?session=${t.context.session}&userID=${t.context.userID}&recipeID=${t.context.recipeID2}`, {
        method: 'delete',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          t.is(res.status, 200);
        });
    });
});
