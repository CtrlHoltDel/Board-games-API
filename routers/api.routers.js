const apiRouter = require('express').Router();

const { listOfAPIs } = require('../controllers/api.controllers');
const categoriesRouter = require('./categories.routers');
const reviewsRouter = require('./reviews.routers');

apiRouter.get('/', listOfAPIs);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;
