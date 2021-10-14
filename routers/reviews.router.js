const {
  getReview,
  patchReview,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/:review_id').get(getReview).patch(patchReview);

module.exports = reviewsRouter;
