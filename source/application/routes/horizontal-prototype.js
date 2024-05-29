const express = require('express');
const fs = require('fs');
const router = express.Router({ mergeParams: true, strict: true });
const handlebars = require('handlebars');

router.get('/', async (req, res) => {
  if ('session' in req.cookies) {
    if ('userID' in req.cookies) {
      res.redirect(307, 'inventory/');
    } else {
      res.redirect(307, 'users/');
    }
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_splash.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Splash - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/inventory/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_inventory.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Inventory - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/inventory/view/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  // TODO: check for id exist using fetch, return 404 if not found
  const raw = fs.readFileSync('./build/horizontal-prototype_inventory-view.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'View - Inventory - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/inventory/search/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_inventory-search.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Search - Inventory - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/inventory/add/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_inventory-add.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Add - Inventory - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/inventory/add/barcode/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_inventory-add-barcode.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Add barcode - Inventory - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/inventory/add/receipt/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_inventory-add-receipt.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Add receipt - Inventory - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/recipes/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_recipes.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Recipes - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/recipes/view/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  // TODO: check for id exist using fetch, return 404 if not found
  const raw = fs.readFileSync('./build/horizontal-prototype_recipes-view.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'View - Recipes - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/recipes/create/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_recipes-create.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Create - Recipes - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/recipes/search/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_recipes-search.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Search - Recipes - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/carts/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_carts.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Carts - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/carts/view/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  // TODO: check for id exist using fetch, return 404 if not found
  const raw = fs.readFileSync('./build/horizontal-prototype_carts-view.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Carts - View - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/consumption/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_consumption.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Consumption - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/consumption/view/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  // TODO: check for id exist using fetch, return 404 if not found
  const raw = fs.readFileSync('./build/horizontal-prototype_consumption-view.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Consumption - View - Horizontal Prototype',
  });
  res.send(render);
});


router.get('/meal-plans/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_meal-plans.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Meal Plans - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/meal-plans/view/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  // TODO: check for id exist using fetch, return 404 if not found
  const raw = fs.readFileSync('./build/horizontal-prototype_meal-plans-view.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'View - Meal Plans - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/meal-plans/search/', async (req, res) => {
  if ('session' in req.cookies) {
    if (!('userID' in req.cookies)) {
      res.redirect(307, '../../users/');
      return;
    }
  } else {
    res.sendStatus(401).end();
    return;
  }
  // TODO: check for plannedTS exist, return 404 if not found
  const raw = fs.readFileSync('./build/horizontal-prototype_meal-plans-search.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Search - Recipes - Horizontal Prototype',
  });
  res.send(render);
});

router.get('/users/', async (req, res) => {
  if (!('session' in req.cookies)) {
    res.sendStatus(401).end();
    return;
  }
  const raw = fs.readFileSync('./build/horizontal-prototype_users.html').toString();
  const handlebarsTemplate = handlebars.compile(raw);
  const render = handlebarsTemplate({
    title: 'Users - Horizontal Prototype',
  });
  res.send(render);
});

module.exports = router;
