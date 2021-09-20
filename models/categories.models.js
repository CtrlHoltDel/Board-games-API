const db = require('../db/connection');

exports.fetchCategories = async () => {
    const categories = await db.query('SELECT * FROM categories;');
    return categories.rows;
};
