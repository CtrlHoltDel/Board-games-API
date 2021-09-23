const devData = require('../data/development-data/index.js');
const testData = require('../data/test-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = (dataType) => {
    return seed(dataType).then(() => db.end());
};

runSeed(testData);
