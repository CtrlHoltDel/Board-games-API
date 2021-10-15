const { pullAllData } = require('../utils/utils');

exports.pullUsers = async () => {
  const users = await pullAllData('users');
  return users;
};
