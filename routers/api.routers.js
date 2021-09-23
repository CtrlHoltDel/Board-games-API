const apiRouter = require('express').Router();

// const { listOfAPIs } = require('../controllers/api.controllers');
const { endPoints } = require('../endpoints');

const {
    categoriesRouter,
    reviewsRouter,
    commentsRouter,
    usersRouter,
} = require('./');

apiRouter.get('/', (req, res) => {
    res.status(200).send({ endPoints });
});
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
