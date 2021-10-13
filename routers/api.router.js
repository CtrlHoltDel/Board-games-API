const apiRouter = require('express').Router();

const { endPoints } = require('../endpoints');

apiRouter.get('/', (req, res) => {
  res.status(200).send({ endPoints });
});

module.exports = apiRouter;
