const {
  fetchReview,
  amendReviewVote,
  fetchReviews,
} = require('../models/reviews.models');

exports.getReview = async ({ params: { review_id } }, res, next) => {
  try {
    const review = await fetchReview(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReview = async ({ body, params: { review_id } }, res, next) => {
  try {
    const review = await amendReviewVote(body, review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async ({ query }, res, next) => {
  try {
    const reviews = await fetchReviews(query);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};
