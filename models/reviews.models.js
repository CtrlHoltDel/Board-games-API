const db = require('../db/connection');

exports.fetchReviewById = async (id) => {
    if (typeof id !== 'number')
        return Promise.reject({
            status: 400,
            endpoint: '/api/reviews/:id',
            error: 'id must be a number',
        });

    const data = await db.query('');
};
