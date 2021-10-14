const {
  getReview,
  patchReview,
  getReviews,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviews);
reviewsRouter.route('/:review_id').get(getReview).patch(patchReview);

module.exports = reviewsRouter;
