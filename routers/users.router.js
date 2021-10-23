const {
  getUsers,
  getUser,
  postUser,
  getUserLikes,
  patchUser,
  getUserComments,
  getUserReviews,
  deleteUser,
} = require('../controllers/users.controllers');

const usersRouter = require('express').Router();

usersRouter.route('/').get(getUsers).post(postUser);
usersRouter
  .route('/:username')
  .get(getUser)
  .patch(patchUser)
  .delete(deleteUser);
usersRouter.get('/:username/likes', getUserLikes);
usersRouter.get('/:username/comments', getUserComments);
usersRouter.get('/:username/reviews', getUserReviews);

module.exports = usersRouter;
