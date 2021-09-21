const express = require('express');
const {
    missingPath,
    error400,
    serverError,
    pgErrors,
} = require('./errors/errors');
const apiRouter = require('./routers/api.routers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', missingPath);

app.use(error400);
app.use(pgErrors);
app.use(serverError);

module.exports = app;
