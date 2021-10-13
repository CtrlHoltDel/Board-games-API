const { fetchReviews, amendReviewVote } = require('../models/reviews.models');

exports.getReviews = async ({ params: { review_id } }, res, next) => {
  try {
    const review = await fetchReviews(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReview = async (
  { body: { inc_votes }, params: { review_id } },
  res,
  next
) => {
  try {
    const review = await amendReviewVote(inc_votes, review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};
