const db = require('../connection');
const { dropTables, createTables } = require('../utils/create-tables');
const { fillTables } = require('../utils/fill-tables');

//Table names
//categories
//reviews
//users
//comments

const seed = async (data) => {
    try {
        await dropTables();
        await createTables();
        await fillTables(data);
    } catch (err) {
        console.log(err);
    }
};

module.exports = seed;
