const { fetchReviewById } = require('../models/reviews.models');

exports.getReviewById = (req, res, next) => {
    const { id } = req.params;
    fetchReviewById(id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            next(err);
        });
};
