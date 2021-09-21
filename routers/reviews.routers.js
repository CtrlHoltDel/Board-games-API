const {
    getReviewById,
    patchVoteById,
    getReviewList,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviewList);
reviewsRouter.route('/:id').get(getReviewById).patch(patchVoteById);

module.exports = reviewsRouter;
