const db = require('../db/connection');

exports.fetchAllUsers = async () => {
    const { rows } = await db.query('SELECT username FROM users;');
    return rows.map((user) => user.username);
};

exports.fetchSingleUser = async (username) => {
    const { rows } = await db.query(
        'SELECT * FROM users WHERE username = $1;',
        [username]
    );

    return rows.length !== 0
        ? rows[0]
        : Promise.reject({ status: 400, error: 'No user with this ID' });
};
