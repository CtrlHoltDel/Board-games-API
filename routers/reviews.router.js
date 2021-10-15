const { postComment } = require('../controllers/comments.controllers');
const {
  getReview,
  patchReviewVote,
  getReviews,
  getReviewComments,
  patchReviewBody,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviews);
reviewsRouter.route('/:review_id').get(getReview).patch(patchReviewVote);
reviewsRouter.patch('/:review_id/edit', patchReviewBody);
reviewsRouter
  .route('/:review_id/comments')
  .get(getReviewComments)
  .post(postComment);
module.exports = reviewsRouter;
