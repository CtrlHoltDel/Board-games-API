const db = require('../db/connection');

exports.fetchReviewById = async (id) => {
    if (!Number(id)) {
        return Promise.reject({
            status: 400,
            endpoint: '/api/reviews/:id',
            error: 'id must be a number',
        });
    }

    const query = `
    SELECT username AS owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.body) FROM users
    JOIN reviews
    ON users.username = reviews.owner
    JOIN comments
    ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY username, title, reviews.review_id;`;

    const data = await db.query(query, [...id]);
    return data.rows[0];
};
