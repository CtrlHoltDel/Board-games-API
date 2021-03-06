const {
  fetchReview,
  amendReviewVote,
  fetchReviews,
  fetchReviewComments,
  amendReviewBody,
  fetchReviewLikes,
  insertReview,
  amendReviewLikes,
  removeReview,
} = require("../models/reviews.models");

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
    const { reviews, count } = await fetchReviews(query);
    res.status(200).send({ reviews, count });
  } catch (err) {
    next(err);
  }
};

exports.getReviewComments = async (req, res, next) => {
  const { review_id } = req.params;
  const { query } = req;
  try {
    const comments = await fetchReviewComments(review_id, query);
    res.status(200).send(comments);
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

exports.getReviewLikes = async (req, res, next) => {
  const { review_id } = req.params;
  const { query } = req;
  try {
    const users = await fetchReviewLikes(review_id, query);
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.postReview = async (req, res, next) => {
  const { body } = req;
  try {
    const review = await insertReview(body);

    res.status(201).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewLikes = async (req, res, next) => {
  const { review_id } = req.params;

  const { body } = req;
  try {
    const like = await amendReviewLikes(review_id, body);
    res.status(201).send({ like });
  } catch (err) {
    next(err);
  }
};

exports.delReview = async (req, res, next) => {
  const { review_id } = req.params;

  const { body } = req;
  try {
    await removeReview(review_id, body);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
