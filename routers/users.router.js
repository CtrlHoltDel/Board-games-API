const {
  getUsers,
  getUser,
  postUser,
  getUserLikes,
  patchUser,
  getUserComments,
  getUserReviews,
  deleteUser,
  getUserLikeByReview,
} = require("../controllers/users.controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers).post(postUser);
usersRouter
  .route("/:username")
  .get(getUser)
  .patch(patchUser)
  .delete(deleteUser);
usersRouter.get("/:username/likes", getUserLikes);
usersRouter.get("/:username/likes/:review_id", getUserLikeByReview);
usersRouter.get("/:username/comments", getUserComments);

module.exports = usersRouter;
