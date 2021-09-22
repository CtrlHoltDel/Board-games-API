const db = require('../db/connection');

exports.fetchAllUsers = async () => {
    const { rows } = await db.query('SELECT username FROM users;');
    return rows.map((user) => user.username);
};
