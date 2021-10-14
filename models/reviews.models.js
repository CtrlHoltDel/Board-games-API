const { query } = require('express');
const {
  pullSingleData,
  pullCount,
  updateVote,
  pullReviews,
} = require('../utils/utils');
const {
  checkId,
  validateBody,
  validateQueryValues,
  validateQueryFields,
} = require('../utils/validation');

exports.fetchReview = async (reviewId) => {
  await checkId(reviewId);

  const review = await pullSingleData('reviews', 'review_id', reviewId);

  const comment_count = await pullCount(
    'comment_id',
    'comments',
    'review_id',
    reviewId
  );

  const likes = await pullCount(
    'review_id',
    'review_likes',
    'review_id',
    reviewId
  );

  return review
    ? { ...review, comment_count, likes }
    : Promise.reject({ status: 404, message: 'Non-existent review' });
};

exports.fetchReviews = async (queries) => {
  await validateQueryFields(queries, [
    'sort_by',
    'order',
    'category',
    'limit',
    'p',
    'search',
  ]);

  await validateQueryValues(queries);

  const { category } = queries;

  let AND = '';

  if (category) {
    AND = `AND reviews.category = $4`;
  }

  const queryBody = `
    SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comment_id) :: INT as comment_count 
    FROM reviews
    LEFT OUTER JOIN comments
    ON reviews.review_id = comments.review_id
    WHERE title iLIKE $3
    ${AND}
    GROUP BY reviews.review_id
    ORDER BY %I %s
    LIMIT $1 OFFSET $2`;

  console.log(queryBody);
  const reviews = await pullReviews(queryBody, { ...queries });

  return reviews;
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
