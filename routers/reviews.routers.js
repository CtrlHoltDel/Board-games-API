const {
    getSingleReview,
    patchReviewVote,
    getReviewList,
    getAllComments,
    postComment,
    postReview,
    delReview,
} = require('../controllers/reviews.controllers');

const reviewsRouter = require('express').Router();

reviewsRouter.route('/').get(getReviewList).post(postReview);
reviewsRouter.route('/:id/comments').get(getAllComments).post(postComment);
reviewsRouter
    .route('/:id')
    .get(getSingleReview)
    .patch(patchReviewVote)
    .delete(delReview);

module.exports = reviewsRouter;
