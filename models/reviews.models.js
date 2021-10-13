const { fetchSingleData, fetchCount, updateVote } = require('../utils/utils');
const { checkId } = require('../utils/validation');

exports.fetchReviews = async (reviewId) => {
  await checkId(reviewId);

  const review = await fetchSingleData('reviews', 'review_id', reviewId);

  const comment_count = await fetchCount(
    'comment_id',
    'comments',
    'review_id',
    reviewId
  );

  const likes = await fetchCount(
    'review_id',
    'review_likes',
    'review_id',
    reviewId
  );

  return review
    ? { ...review, comment_count, likes }
    : Promise.reject({ status: 404, message: 'Non-existent review' });
};

exports.amendReviewVote = async (votes, review_id) => {
  const review = await updateVote(votes, review_id);

  return review;
};
