const format = require('pg-format');
const db = require('../db/connection');
const {
  pullCount,
  updateVote,
  pullList,
  updateBody,
  insertItem,
  deleteFromDb,
} = require('../utils/utils');
const {
  checkId,
  validateBody,
  validateQueryValues,
  validateQueryFields,
  validateExistence,
  validatePagination,
} = require('../utils/validation');

exports.fetchReview = async (reviewId) => {
  await checkId(reviewId);

  const review = await pullList('reviews', 'review_id', reviewId);

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

  return review[0]
    ? { ...review[0], comment_count, likes }
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

  await validateQueryValues(queries, [
    'votes',
    'category',
    'comment_count',
    'created_at',
  ]);

  let {
    sort_by = 'created_at',
    order = 'desc',
    category,
    limit = 10,
    p = 0,
    search = '%%',
  } = queries;

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

  if (+p) p = limit * (p - 1);

  let values = [limit, p, `%${search}%`];

  if (category) {
    values.push(category.replace('_', ' '));
  }

  const updatedQueryBody = format(queryBody, sort_by, order);
  const { rows } = await db.query(updatedQueryBody, values);

  return rows;
};

exports.amendReviewVote = async (votes, reviewId) => {
  await checkId(reviewId);
  await validateBody(votes, ['inc_votes', 'number']);

  const { inc_votes } = votes;

  const review = await updateVote('reviews', inc_votes, 'review_id', reviewId);

  return review
    ? review
    : Promise.reject({ status: 404, message: 'Non-existent review' });
};

exports.fetchReviewComments = async (reviewId, query) => {
  let { limit = 10, p = 0 } = query;

  if (+p) p = limit * (p - 1);

  await checkId(reviewId);

  await validateExistence(
    'reviews',
    'review_id',
    reviewId,
    'Non existent review'
  );

  const comments = await pullList('comments', 'review_id', reviewId, limit, p);

  return comments;
};

exports.amendReviewBody = async (input, reviewId) => {
  await checkId(reviewId);
  await validateBody(input, ['body', 'string']);
  await validateExistence(
    'reviews',
    'review_id',
    reviewId,
    'Non-existent review'
  );

  const { body } = input;

  const review = await updateBody(
    'reviews',
    'review_body',
    body,
    'review_id',
    reviewId
  );

  return review[0];
};

exports.fetchReviewLikes = async (reviewId, query) => {
  const { limit = 10, p = 0 } = query;

  await validatePagination(limit, p);

  await checkId(reviewId);
  await validateExistence(
    'reviews',
    'review_id',
    reviewId,
    'Non-existent review'
  );
  const queryBody = `
      SELECT review_likes.username, avatar_url  FROM review_likes
      LEFT OUTER JOIN users ON review_likes.username = users.username
      WHERE review_id = $1
      LIMIT $2 OFFSET $3
      `;

  const { rows } = await db.query(queryBody, [reviewId, limit, p]);
  return rows;
};

exports.insertReview = async (body) => {
  const { title, review_body, designer, review_img_url, category, owner } =
    body;

  const rows = ['title', 'review_body', 'designer', 'category', 'owner'];
  const values = [title, review_body, designer, category, owner];

  await validateExistence('users', 'username', owner, 'Invalid username');

  await validateBody(
    { title, review_body, designer, category, owner },
    ['title', 'string'],
    ['review_body', 'string'],
    ['designer', 'string'],
    ['category', 'string'],
    ['owner', 'string']
  );

  if (review_img_url) {
    rows.push('review_img_url');
    values.push(review_img_url);
  }

  const review = await insertItem('reviews', rows, values);

  return review;
};

exports.amendReviewLikes = async (reviewId, body) => {
  const { username } = body;
  await checkId(reviewId);
  await validateBody(body, ['username', 'string']);
  await validateExistence(
    'reviews',
    'review_id',
    reviewId,
    'Non existent review'
  );
  await validateExistence('users', 'username', username, 'Non existent user');

  const { rows } = await db.query(
    'SELECT * FROM review_likes WHERE username = $1 AND review_id = $2',
    [username, reviewId]
  );

  if (rows.length) {
    await db.query(
      `DELETE FROM review_likes WHERE username = $1 AND review_id = $2
    `,
      [username, reviewId]
    );
  } else {
    const addedLike = await insertItem(
      'review_likes',
      ['username', 'review_id'],
      [username, reviewId]
    );

    return addedLike;
  }
};
