const { fetchReviews } = require('../models/reviews.models');

exports.getReviews = async ({ params: { review_id } }, res, next) => {
  try {
    const review = await fetchReviews(review_id);
    res.status(200).send({ review });
  } catch (err) {
    console.log(err);
  }
};
