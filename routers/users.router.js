const {
  getUsers,
  getUser,
  postUser,
} = require('../controllers/users.controllers');

const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers).post(postUser);
usersRouter.get('/:username', getUser);

module.exports = usersRouter;
