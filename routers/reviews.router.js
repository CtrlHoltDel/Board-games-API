const { postComment } = require('../controllers/comments.controllers');
const {
  getReview,
  patchReviewVote,
  getReviews,
  getReviewComments,
  patchReviewBody,
  getReviewLikes,
  postReview,
  patchReviewLikes,
  delReview,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/').get(getReviews).post(postReview);
reviewsRouter
  .route('/:review_id')
  .get(getReview)
  .patch(patchReviewVote)
  .delete(delReview);
reviewsRouter.patch('/:review_id/edit', patchReviewBody);
reviewsRouter
  .route('/:review_id/likes')
  .get(getReviewLikes)
  .patch(patchReviewLikes);
reviewsRouter
  .route('/:review_id/comments')
  .get(getReviewComments)
  .post(postComment);
module.exports = reviewsRouter;
