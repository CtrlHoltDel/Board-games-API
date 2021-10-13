const apiRouter = require('express').Router();

const categoriesRouter = require('./categories.router');
const reviewsRouter = require('./reviews.router');

const { endPoints } = require('../endpoints');

apiRouter.get('/', (req, res) => {
  res.status(200).send({ endPoints });
});

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;
