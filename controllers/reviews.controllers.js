const { fetchReviewById } = require('../models/reviews.models');

exports.getReviewById = (req, res, next) => {
    const { id } = req.params;
    fetchReviewById(id).catch((err) => {
        next(err);
    });
};
