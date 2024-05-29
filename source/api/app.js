'use strict';

const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = express();
const httpPort = 80;
const httpsPort = 443;
const httpsOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert'),
};
const compression = require('compression');
const cors = require('cors');

app.use(express.json());
app.use(compression());
app.use(cors());

app.use('/v1', require('./routes/v1/index.js'));
app.use('/v2', require('./routes/v2/index.js'));
app.use('/v3', require('./routes/v3/index.js'));
app.use('/v4', require('./routes/v4/index.js'));

app.get('/', (req, res) => res.sendStatus(401).end());

http.createServer(app).listen(httpPort);
https.createServer(httpsOptions, app).listen(httpsPort);
