const {
    fetchReviewById,
    updateVoteById,
    fetchAllReviews,
    fetchCommentsByReviewId,
    addCommentToReview,
} = require('../models/reviews.models');

exports.getReviewById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const review = await fetchReviewById(id);
        res.status(200).send({ review });
    } catch (err) {
        next(err);
    }
};

exports.patchVoteById = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    try {
        const updated_review = await updateVoteById(id, body);
        res.status(200).send({ updated_review });
    } catch (err) {
        next(err);
    }
};

exports.getReviewList = async (req, res, next) => {
    try {
        const reviews = await fetchAllReviews(req.query);
        res.status(200).send({ reviews });
    } catch (err) {
        next(err);
    }
};

exports.getCommentsByReviewId = async (req, res, next) => {
    const { id } = req.params;
    try {
        const reviews = await fetchCommentsByReviewId(id);
        res.status(200).send({ reviews });
    } catch (err) {
        next(err);
    }
};

exports.postCommentByReview = async (req, res, next) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const comment = await addCommentToReview(id, body);
        res.status(200).send({ comment });
    } catch (err) {
        next(err);
    }
};
