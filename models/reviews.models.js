const { fetchSingleData, fetchCount, updateVote } = require('../utils/utils');
const { checkId, validateBody } = require('../utils/validation');

exports.fetchReview = async (reviewId) => {
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
  await checkId(review_id);
  await validateBody(votes, ['inc_votes', 'number']);

  const { inc_votes } = votes;

  const review = await updateVote(inc_votes, review_id);

  return review
    ? review
    : Promise.reject({ status: 404, message: 'Non-existent review' });
};
