const { getReviews } = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.get('/:review_id', getReviews);

module.exports = reviewsRouter;
