const db = require('../db/connection');
const { rejPromise } = require('../utils/utils');
const {
    fetchAllReviewsValidate,
    formatCheckVote,
} = require('../utils/validation');

exports.fetchReviewById = async (id) => {
    if (!Number(id)) {
        return rejPromise(400, '/api/reviews/:id', 'id must be a number');
    }

    const query = `
        SELECT username AS owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.body) FROM users
        JOIN reviews
        ON users.username = reviews.owner
        JOIN comments
        ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        GROUP BY username, title, reviews.review_id;`;

    const result = await db.query(query, [...id]);
    return result.rows[0];
};

exports.updateVoteById = async (id, input) => {
    if (!Number(id)) {
        return rejPromise(400, '/api/reviews/:id', 'id must be a number');
    }
    if (!formatCheckVote(input)) {
        return rejPromise(
            400,
            '/api/reviews/:id',
            'format to { inc_votes : number }'
        );
    }

    const query = `
    UPDATE reviews
    SET votes = votes + ${input.inc_votes}
    WHERE review_id = $1
    RETURNING *;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

exports.fetchAllReviews = async (queries) => {
    let ORDER = '';
    let WHERE = '';

    if (!fetchAllReviewsValidate(queries)) {
        return rejPromise(400, '/api/reviews?category=query', {
            valid_queries: ['sort_by', 'order', 'category'],
        });
    }

    if (queries.order) ORDER = ` ORDER BY reviews.review_id ${queries.order}`;

    if (queries.category) {
        const category = queries.category.replace('_', ' ');
        WHERE = ` WHERE category = '${category}'`;
    }

    const query_body = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(body) amount_of_comments FROM comments
    FULL OUTER JOIN reviews
    ON comments.review_id = reviews.review_id
    ${WHERE}
    GROUP BY title, owner, reviews.review_id
    ${ORDER}
    ;`;

    const reviews = await db.query(query_body);
    return reviews.rows;
};
