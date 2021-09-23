const {
    fetchReviewById,
    updateVoteById,
    fetchAllReviews,
    fetchCommentsByReviewId,
    addCommentToReview,
    addReview,
    removeReview,
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
        const review = await updateVoteById(id, body);
        res.status(201).send({ review });
    } catch (err) {
        next(err);
    }
};

exports.getReviewList = async (req, res, next) => {
    const { query } = req;
    try {
        const { reviews, count } = await fetchAllReviews(query);
        res.status(200).send({ count, reviews });
    } catch (err) {
        next(err);
    }
};

exports.getCommentsByReviewId = async (req, res, next) => {
    const { id } = req.params;
    const { query } = req;
    try {
        const reviews = await fetchCommentsByReviewId(id, query);
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
        res.status(201).send({ comment });
    } catch (err) {
        next(err);
    }
};

exports.postReview = async (req, res, next) => {
    const { body } = req;
    try {
        const review = await addReview(body);
        res.status(201).send({ review });
    } catch (err) {
        next(err);
    }
};

exports.delReview = async (req, res, next) => {
    const { id } = req.params;
    try {
        await removeReview(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
