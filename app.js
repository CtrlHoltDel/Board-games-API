const express = require('express');
const apiRouter = require('./routers/api.router');
const cors = require('cors');
const {
  invalidEndpoint,
  customError,
  serverError,
  psqlError,
} = require('./errors/errors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', invalidEndpoint);

app.use(customError);
app.use(psqlError);
app.use(serverError);

module.exports = app;
