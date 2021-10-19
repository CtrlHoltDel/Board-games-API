const db = require('../db/connection');
const {
  pullAllData,
  pullList,
  insertItem,
  updateBody,
} = require('../utils/utils');
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

exports.fetchUserLikes = async (username, queries) => {
  let { order = 'desc', limit = 10, p = 0 } = queries;

  await validatePagination(limit, p);
  await validateExistence('users', 'username', username, 'Non-existent user');

  if (+p) p = limit * (p - 1);

  const queryBody = `
    SELECT review_id, liked_at FROM review_likes
    WHERE username = $1
    ORDER BY liked_at ${order}
    LIMIT $2 OFFSET $3;
  `;

  const { rows } = await db.query(queryBody, [username, limit, p]);

  return rows;
};

exports.amendUser = async (username, body) => {
  await validateExistence('users', 'username', username, 'Non-existent user');
  await validateBody(
    body,
    ['avatar_url', 'string'],
    ['email', 'string'],
    ['name', 'string']
  );
  console.log(username, body);
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
