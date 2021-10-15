const {
  fetchReview,
  amendReviewVote,
  fetchReviews,
  fetchReviewComments,
  amendReviewBody,
} = require('../models/reviews.models');

exports.getReview = async (req, res, next) => {
  const { review_id } = req.params;

  try {
    const review = await fetchReview(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewVote = async (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  try {
    const review = await amendReviewVote(body, review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  const { query } = req;
  try {
    const reviews = await fetchReviews(query);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.getReviewComments = async (req, res, next) => {
  const { review_id } = req.params;
  try {
    const comments = await fetchReviewComments(review_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewBody = async (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;

  try {
    const review = await amendReviewBody(body, review_id);

    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};
