const apiRouter = require('express').Router();

const { listOfAPIs } = require('../controllers/api.controllers');

const {
    categoriesRouter,
    reviewsRouter,
    commentsRouter,
    usersRouter,
} = require('./routerIndex');

apiRouter.get('/', listOfAPIs);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
