const {
  getUsers,
  getUser,
  postUser,
  getUserLikes,
  patchUser,
} = require('../controllers/users.controllers');

const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers).post(postUser);
usersRouter.route('/:username').get(getUser).patch(patchUser);
usersRouter.get('/:username/likes', getUserLikes);

module.exports = usersRouter;
