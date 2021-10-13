const { fetchSingleData, fetchCount } = require('../utils/utils');

exports.fetchReviews = async (reviewId) => {
  const review = await fetchSingleData('reviews', 'review_id', reviewId);

  const comment_count = await fetchCount(
    'comment_id',
    'comments',
    'review_id',
    reviewId
  );

  // const likes = await fetchCount('liked_review', 'review_likes');

  return { ...review, comment_count };
};
