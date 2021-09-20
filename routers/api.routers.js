const apiRouter = require('express').Router();

const categoriesRouter = require('./categories.routers');

apiRouter.use('/categories', categoriesRouter);

module.exports = apiRouter;
