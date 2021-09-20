const apiRouter = require('express').Router();

const categoriesRouter = require('./categories.routers');
const reviewsRouter = require('./reviews.routers');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;
