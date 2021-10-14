const { pullAllData } = require('../utils/utils');

exports.fetchCategories = async () => {
  const result = await pullAllData('categories');
  return result;
};
