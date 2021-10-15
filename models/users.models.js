const { pullAllData, pullList, insertItem } = require('../utils/utils');
const { validateBody } = require('../utils/validation');

exports.fetchUsers = async () => {
  const users = await pullAllData('users');
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

exports.fetchUserLIkes = async (username) => {
  console.log(username);
};
