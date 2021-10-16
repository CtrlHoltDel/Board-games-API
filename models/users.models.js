const db = require('../db/connection');
const { pullAllData, pullList, insertItem } = require('../utils/utils');
const {
  validateBody,
  validateExistence,
  validatePagination,
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

exports.addUser = async (queries) => {
  const { username, avatar_url, name, email } = queries;

  await validateBody(
    queries,
    ['username', 'string'],
    ['avatar_url', 'string'],
    ['name', 'string'],
    ['email', 'string']
  );

  const user = await insertItem(
    'users',
    ['username', 'avatar_url', 'name', 'email'],
    [username, avatar_url, name, email]
  );

  return user;
};

exports.fetchUserLikes = async (username, queries) => {
  let { order = 'desc', limit = 10, p = 0 } = queries;

  await validatePagination(limit, p);
  await validateExistence('users', 'username', username, 'Non-existent user');

  if (+p) p = limit * (p - 1);

  const queryBody = `
    SELECT liked_at, title, owner, review_body, review_img_url, votes, category, owner, created_at FROM review_likes
    JOIN reviews ON review_likes.review_id = reviews.review_id
    WHERE username = $1
    ORDER BY liked_at ${order}
    LIMIT $2 OFFSET $3;
  `;

  const { rows } = await db.query(queryBody, [username, limit, p]);

  return rows;
};
