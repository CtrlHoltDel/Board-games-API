const {
    getReviewById,
    patchVoteById,
    getReviewList,
    getCommentsByReviewId,
    postCommentByReview,
    postReview,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/').get(getReviewList).post(postReview);
reviewsRouter
    .route('/:id/comments')
    .get(getCommentsByReviewId)
    .post(postCommentByReview);
reviewsRouter.route('/:id').get(getReviewById).patch(patchVoteById);

module.exports = reviewsRouter;
