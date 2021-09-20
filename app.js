const express = require('express');
const { missingPath } = require('./errors/errors');
const apiRouter = require('./routers/api.routers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', missingPath);

module.exports = app;
