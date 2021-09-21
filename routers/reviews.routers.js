const {
    getReviewById,
    patchVoteById,
    getReviewList,
    getCommentsByReviewId,
    postCommentByReview,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.get('/', getReviewList);
reviewsRouter
    .route('/:id/comments')
    .get(getCommentsByReviewId)
    .post(postCommentByReview);
reviewsRouter.route('/:id').get(getReviewById).patch(patchVoteById);

module.exports = reviewsRouter;
