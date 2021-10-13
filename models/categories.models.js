const { fetchAllData } = require('../utils/utils');

exports.fetchCategories = async () => {
  const result = await fetchAllData('categories');
  return result;
};
