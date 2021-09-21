const express = require('express');
const {
    missingPath,
    customError,
    serverError,
    pgErrors,
} = require('./errors/errors');
const apiRouter = require('./routers/api.routers');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', missingPath);

app.use(customError);
app.use(pgErrors);
app.use(serverError);

module.exports = app;
