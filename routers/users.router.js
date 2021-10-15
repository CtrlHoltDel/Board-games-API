const {
  getUsers,
  getUser,
  postUser,
  getUserLikes,
} = require('../controllers/users.controllers');

const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers).post(postUser);
usersRouter.get('/:username', getUser);
usersRouter.get('/:username/likes', getUserLikes);

module.exports = usersRouter;
