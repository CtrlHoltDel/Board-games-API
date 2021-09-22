const db = require('../db/connection');
const { limitOffset } = require('../utils/utils');
const validate = require('../utils/validation');

exports.fetchReviewById = async (id) => {
    await validate.id(id, '/api/reviews/:id');

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
    await validate.id(id, '/api/reviews/:id');
    await validate.voteIncrementer(input, '/api/reviews/:id');

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
    const { limit, sort_by, order, category, p } = queries;

    let ORDER = ` ORDER BY reviews.review_id desc`;
    let WHERE = '';

    await validate.allReviews(queries);

    if (order) ORDER = ` ORDER BY reviews.review_id ${queries.order}`;
    if (sort_by) {
        let column = queries.sort_by === '' ? 'created_at' : queries.sort_by;
        await validate.sortBy(column);
        ORDER = ` ORDER BY ${column} ASC`;
    }
    if (category) {
        const category = queries.category.replace('_', ' ');
        WHERE = ` WHERE category = '${category}'`;
    }
    const { LIMIT, OFFSET } = limitOffset(limit, p);

    const queryBody = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(body) amount_of_comments FROM comments
    FULL OUTER JOIN reviews
    ON comments.review_id = reviews.review_id
    ${WHERE}
    GROUP BY title, owner, reviews.review_id
    ${ORDER}
    LIMIT $1 OFFSET $2
    ;`;

    const allResults = await db.query(`SELECT COUNT(*) from reviews ${WHERE}`);
    const { count } = allResults.rows[0];

    const { rows } = await db.query(queryBody, [LIMIT, OFFSET]);

    if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            endpoint: '/api/reviews?category=query',
            error: 'Invalid query',
        });
    } else {
        return { reviews: rows, count: count };
    }
};

exports.fetchCommentsByReviewId = async (id, queries) => {
    const { limit, p } = queries;

    const { LIMIT, OFFSET } = limitOffset(limit, p);

    await validate.id(id, '/api/reviews/:id/comments');
    const queryBody = `
                SELECT review_id, comment_id, votes, created_at, username, body FROM comments
                JOIN users
                ON users.username = comments.author
                WHERE review_id = $1
                LIMIT $2 OFFSET $3;`;
    const { rows } = await db.query(queryBody, [id, LIMIT, OFFSET]);

    return rows.length !== 0
        ? rows
        : Promise.reject({
              status: 404,
              endpoint: '/api/reviews/:review_id/comments?limit=?&p=?',
              error: 'Invalid query',
          });
};

exports.addCommentToReview = async (id, { username, body }) => {
    await validate.addComment(username, body);

    const queryBody = `INSERT INTO comments(author, review_id, created_at, body)
        VALUES ($1,$2,$3,$4)
        RETURNING *;`;

    const result = await db.query(queryBody, [username, id, new Date(), body]);
    return result.rows[0];
};
