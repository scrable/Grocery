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
    app.use('/v3', require('../../routes/v3/index.js'));
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
            .then(async (data2) => {
              t.context.session = data2.session;
              await fetch(`${t.context.baseUrl}/v3/users`, {
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
                .then((res3) => {
                  t.is(res3.status, 200);
                  return res3.json();
                })
                .then(async (data3) => {
                  t.context.userID = data3.userID;
                  await fetch(`${t.context.baseUrl}/v3/ingredients`, {
                    method: 'post',
                    headers: {
                      Accept: 'application/json',
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

test('/inventory/list/all | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/list/all?session=abcd&page=1&limit=10`, {
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

test('/inventory/list/all | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/list/all?session=123456789012345678901234567890123456&page=1&limit=10`, {
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

test('/inventory/list/all | GET | 406', async (t) => {
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
          await fetch(`${t.context.baseUrl}/v3/inventory/list/all?session=${data2.session}&page=1&limit=10`, {
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

test('/inventory/list/all | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 10,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/inventory/list/all?session=${t.context.session}&page=1&limit=10`, {
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
          t.is(Object.keys(data2[0]).length, 6);
          t.true('inventoryID' in data2[0]);
          t.true('ingredientID' in data2[0]);
          t.true('expirationDate' in data2[0]);
          t.true('totalQuantity' in data2[0]);
          t.true('unit' in data2[0]);
          t.true('price' in data2[0]);
          t.is(typeof data2[0].inventoryID, 'number');
          t.is(typeof data2[0].ingredientID, 'number');
          t.is(typeof data2[0].expirationDate, 'string');
          t.is(typeof data2[0].totalQuantity, 'number');
          t.is(typeof data2[0].unit, 'string');
          t.is(typeof data2[0].price, 'number');
        });
    });
});

test('/inventory/list/stored | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/list/stored?session=abcd&page=1&limit=10`, {
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

test('/inventory/list/stored | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/list/stored?session=123456789012345678901234567890123456&page=1&limit=10`, {
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

test('/inventory/list/stored | GET | 406', async (t) => {
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
          await fetch(`${t.context.baseUrl}/v3/inventory/list/stored?session=${data2.session}&page=1&limit=10`, {
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

test('/inventory/list/stored | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 10,
      unit: 'stedt',
      expirationDate: Math.floor(new Date('2025-01-01').getTime() / 1000),
      price: '12',
      session: t.context.session,
    }),
  })
    .then((res) => t.log)
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/inventory/list/stored?session=${t.context.session}&page=1&limit=10`, {
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
          t.is(Object.keys(data2[0]).length, 6);
          t.true('inventoryID' in data2[0]);
          t.true('ingredientID' in data2[0]);
          t.true('expirationDate' in data2[0]);
          t.true('totalQuantity' in data2[0]);
          t.true('unit' in data2[0]);
          t.true('price' in data2[0]);
          t.is(typeof data2[0].inventoryID, 'number');
          t.is(typeof data2[0].ingredientID, 'number');
          t.is(typeof data2[0].expirationDate, 'string');
          t.is(typeof data2[0].totalQuantity, 'number');
          t.is(typeof data2[0].unit, 'string');
          t.is(typeof data2[0].price, 'number');
        });
    });
});

test('/inventory/list/expired | GET | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/list/expired?session=abcd&page=1&limit=10`, {
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

test('/inventory/list/expired | GET | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/list/expired?session=123456789012345678901234567890123456&page=1&limit=10`, {
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

test('/inventory/list/expired | GET | 406', async (t) => {
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
          await fetch(`${t.context.baseUrl}/v3/inventory/list/expired?session=${data2.session}&page=1&limit=10`, {
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

test('/inventory/list/expired | GET | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: '10',
      unit: 'stedt',
      expirationDate: 23455,
      price: '12',
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/inventory/list/expired?session=${t.context.session}&page=1&limit=10`, {
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
          t.is(Object.keys(data2[0]).length, 6);
          t.true('inventoryID' in data2[0]);
          t.true('ingredientID' in data2[0]);
          t.true('expirationDate' in data2[0]);
          t.true('totalQuantity' in data2[0]);
          t.true('unit' in data2[0]);
          t.true('price' in data2[0]);
          t.is(typeof data2[0].inventoryID, 'number');
          t.is(typeof data2[0].ingredientID, 'number');
          t.is(typeof data2[0].expirationDate, 'string');
          t.is(typeof data2[0].totalQuantity, 'number');
          t.is(typeof data2[0].unit, 'string');
          t.is(typeof data2[0].price, 'number');
        });
    });
});

test('/inventory/add/manual | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: -1,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: 'abcd',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/inventory/add/manual | POST | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 1,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: '123456789012345678901234567890123456',
    }),
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/inventory/add/manual | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 1,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: t.context.session,
    }),
  })
    .then((res) => {
      t.is(res.status, 200);
      return res.json();
    })
    .then((data) => {
      t.is(Object.keys(data).length, 1);
      t.true('inventoryID' in data);
    });
});

test('/inventory/consume | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/consume`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      inventoryID: t.context.inventoryID,
      quantity: -1,
      unit: 'stedt',
      session: 'abcd',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/inventory/consume | POST | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/consume`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      inventoryID: t.context.inventoryID,
      quantity: 1,
      unit: 'stedt',
      session: '123456789012345678901234567890123456',
    }),
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/inventory/consume | POST | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 1,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/inventory/consume`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: 999999,
          inventoryID: data.inventoryID,
          quantity: 1,
          unit: 'stedt',
          session: t.context.session,
        }),
      })
        .then((res2) => {
          t.is(res2.status, 406);
        });
    });
});

test('/inventory/consume | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 1,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/inventory/consume`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: t.context.userID,
          inventoryID: data.inventoryID,
          quantity: 1,
          unit: 'stedt',
          session: t.context.session,
        }),
      })
        .then((res2) => {
          t.is(res2.status, 200);
        });
    });
});

test('/inventory/discard | POST | 400', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/discard`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      inventoryID: t.context.inventoryID,
      quantity: '-1',
      unit: 'stedt',
      session: 'abcd',
    }),
  })
    .then((res) => {
      t.is(res.status, 400);
    });
});

test('/inventory/discard | POST | 401', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/discard`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      inventoryID: t.context.inventoryID,
      quantity: 1,
      unit: 'stedt',
      session: '123456789012345678901234567890123456',
    }),
  })
    .then((res) => {
      t.is(res.status, 401);
    });
});

test('/inventory/discard | POST | 406', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 1,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/inventory/discard`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: 999999,
          inventoryID: data.inventoryID,
          quantity: 1,
          unit: 'stedt',
          session: t.context.session,
        }),
      })
        .then((res2) => {
          t.is(res2.status, 406);
        });
    });
});

test('/inventory/discard | POST | 200', async (t) => {
  await fetch(`${t.context.baseUrl}/v3/inventory/add/manual`, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: t.context.userID,
      ingredientID: t.context.ingredientID,
      totalQuantity: 5,
      unit: 'stedt',
      expirationDate: 23455,
      price: 12,
      session: t.context.session,
    }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      await fetch(`${t.context.baseUrl}/v3/inventory/discard`, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: t.context.userID,
          inventoryID: data.inventoryID,
          quantity: 1,
          unit: 'stedt',
          session: t.context.session,
        }),
      })
        .then((res2) => {
          t.is(res2.status, 200);
        });
    });
});
