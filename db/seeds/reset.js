const db = require('../connection.js');
const devData = require('../data/development-data/index.js');
const testData = require('../data/test-data/index.js');
const seed = require('./seed.js');

fillBothDatabases = async () => {
    await seed(testData);
    await seed(devData);
    db.end();
};

fillBothDatabases();
