const db = require('../db/connection');
const {
  pullAllData,
  pullList,
  insertItem,
  updateBody,
} = require('../utils/utils');
const {
  validateBody,

  validatePagination,
  validateUser,
} = require('../utils/validation');

exports.fetchUsers = async (query) => {
  const { limit = 10, p = 0 } = query;

  await validatePagination(limit, p);

  const users = await pullAllData('users', limit, p);
  return users;
};

exports.fetchUser = async (username) => {
  const user = await pullList('users', 'username', username);

  if (!user.length) {
    return Promise.reject({ status: 404, message: 'Non-existent user' });
  }

  return user[0];
};

exports.fetchUserLikes = async (username, queries) => {
  let { order = 'desc', limit = 10, p = 0 } = queries;

  await validatePagination(limit, p);
  await validateUser(username);

  if (+p) p = limit * (p - 1);

  const queryBody = `
    SELECT * FROM review_likes JOIN reviews ON reviews.review_id = review_likes.review_id
    WHERE username = $1
    ORDER BY liked_at ${order}
    LIMIT $2 OFFSET $3;
  `;

  const { rows } = await db.query(queryBody, [username, limit, p]);

  return rows;
};

exports.fetchUserComments = async (username, queries) => {
  let { limit = 10, p = 0 } = queries;

  await validatePagination(limit, p);
  await validateUser(username);

  if (+p) p = limit * (p - 1);

  const { rows } = await db.query(
    `SELECT comment_id, author, comments.review_id, comments.votes, comments.body, reviews.title, comments.created_at FROM comments
  JOIN reviews ON comments.review_id = reviews.review_id
  WHERE author = $1 LIMIT $2 OFFSET $3`,
    [username, limit, p]
  );

  return rows;
};

exports.fetchUserReviews = async (username, queries) => {
  const { limit = 10, p = 0 } = queries;

  await validatePagination(limit, p);
  await validateUser(username);

  const res = await pullList('reviews', 'owner', username, limit, p);

  return res;
};

exports.addUser = async (queries) => {
  const { username, avatar_url = '', name = '', email } = queries;

  await validateBody(
    { username, avatar_url, name, email },
    ['username', 'string'],
    ['avatar_url', 'string'],
    ['name', 'string'],
    ['email', 'string']
  );

  const rows = ['username', 'email'];
  const values = [username, email];

  if (avatar_url) {
    rows.push('avatar_url');
    values.push(avatar_url);
  }

  if (name) {
    rows.push('name');
    values.push(name);
  }

  const user = await insertItem('users', rows, values);

  return user;
};

exports.amendUser = async (username, body) => {
  await validateUser(username);
  await validateBody(
    body,
    ['avatar_url', 'string'],
    ['email', 'string'],
    ['name', 'string']
  );
  const { avatar_url, email, name } = body;
  const queryBody = `
    UPDATE users
    SET avatar_url = $1, name = $2, email = $3
    WHERE username = $4 RETURNING *
    `;

  const { rows } = await db.query(queryBody, [
    avatar_url,
    name,
    email,
    username,
  ]);

  return rows;
};
