const apiRouter = require('express').Router();

const { listOfAPIs } = require('../controllers/api.controllers');
const categoriesRouter = require('./categories.routers');
const commentsRouter = require('./comments.routers');
const reviewsRouter = require('./reviews.routers');

apiRouter.get('/', listOfAPIs);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
