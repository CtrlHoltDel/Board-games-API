const {
    getReviewById,
    patchVoteById,
    getReviewList,
    getCommentsByReviewId,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviewList);
reviewsRouter.route('/:id/comments').get(getCommentsByReviewId);
reviewsRouter.route('/:id').get(getReviewById).patch(patchVoteById);

module.exports = reviewsRouter;
