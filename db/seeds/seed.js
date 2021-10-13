const { dropTables, createTables } = require('../utils/create-tables');
const { fillTables } = require('../utils/fill-tables');

const seed = async (data) => {
  await dropTables();
  await createTables();
  await fillTables(data);
};

module.exports = seed;
