const {
  getReviews,
  patchReview,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/:review_id').get(getReviews).patch(patchReview);

module.exports = reviewsRouter;
