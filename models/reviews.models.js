const db = require('../db/connection');
const {
    fetchAllReviewsValidate,
    formatCheckVote,
    validateSortBy,
} = require('../utils/validation');

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

    const result = await db.query(query, [id]);
    if (!result.rows[0])
        return Promise.reject({
            status: 400,
            error: `No reviews with an id of ${id}`,
            endpoint: '/api/reviews/:id',
        });
    return result.rows[0];
};

exports.updateVoteById = async (id, input) => {
    if (!Number(id)) {
        return Promise.reject({
            status: 400,
            endpoint: '/api/reviews/:id',
            error: 'id must be a number',
        });
    }

    await formatCheckVote(input);
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
    let ORDER = ` ORDER BY reviews.review_id desc`;
    let WHERE = '';

    await fetchAllReviewsValidate(queries);

    if (queries.sort_by !== undefined) {
        let column = queries.sort_by === '' ? 'created_at' : queries.sort_by;
        console.log(column);
        await validateSortBy(column);
        ORDER = ` ORDER BY ${column} ASC`;
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

    if (reviews.rows.length === 0) {
        return Promise.reject({
            status: 404,
            endpoint: '/api/reviews?category=query',
            error: 'Invalid query',
        });
    }

    return reviews.rows.length === 0
        ? Promise.reject({
              status: 404,
              endpoint: '/api/reviews?category=query',
              error: 'Invalid query',
          })
        : reviews.rows;
};

exports.fetchCommentsByReviewId = async (id) => {
    if (!Number(id)) {
        return Promise.reject({
            status: 400,
            endpoint: '/api/reviews/:id',
            error: 'id must be a number',
        });
    }
    const query_body = `
                SELECT review_id, comment_id, votes, created_at, username, body FROM comments
                JOIN users
                ON users.username = comments.author
                WHERE review_id = $1;`;
    const result = await db.query(query_body, [id]);
    return result.rows;
};
