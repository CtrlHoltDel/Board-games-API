const {
  getReview,
  patchReview,
  getReviews,
  getReviewComments,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviews);
reviewsRouter.route('/:review_id').get(getReview).patch(patchReview);
reviewsRouter.route('/:review_id/comments').get(getReviewComments);
module.exports = reviewsRouter;
