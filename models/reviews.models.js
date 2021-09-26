const { all } = require('../app');
const db = require('../db/connection');
const {
    limitOffset,
    buildReviewQuery,
    amountOfReviews,
} = require('../utils/utils');
const validate = require('../utils/validation');

exports.fetchReviewById = async (id) => {
    await validate.id(id);

    const query = `
    SELECT username AS owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.body) AS comment_count FROM users
    JOIN reviews
    ON users.username = reviews.owner
    JOIN comments
    ON comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY username, title, reviews.review_id;`;

    const result = await db.query(query, [id]);
    if (!result.rows[0])
        return Promise.reject({
            status: 404,
            error: `No reviews with an id of ${id}`,
        });
    return result.rows[0];
};

const amendVoteById = async (id, amount) => {
    const query = `
    UPDATE reviews
    SET votes = votes + ${amount}
    WHERE review_id = $1
    RETURNING *;
    `;

    const { rows } = await db.query(query, [id]);

    if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            error: `No reviews with an id of ${id}`,
        });
    }

    return rows[0];
};

const amendBodyById = async (id, edit) => {
    const query = `
        UPDATE reviews
        SET review_body = $1
        WHERE review_id = $2
        RETURNING *;
        `;

    const { rows } = await db.query(query, [edit, id]);

    return rows[0];
};

exports.amendReview = async (id, input) => {
    await validate.id(id);
    await validate.bodyPatch(input);

    if (input.inc_votes !== undefined) {
        return await amendVoteById(id, input.inc_votes);
    }

    if (input.edit !== undefined) {
        return await amendBodyById(id, input.edit);
    }
};

exports.fetchAllReviews = async (queries) => {
    const { limit, p } = queries;
    const { LIMIT, OFFSET } = limitOffset(limit, p);

    await validate.allReviews(queries);

    const { queryBody, cat } = await buildReviewQuery(queries);

    const reviewCount = await amountOfReviews(cat);

    const queryArray = [LIMIT, OFFSET];

    if (cat) {
        queryArray.push(cat);
    }

    const { rows } = await db.query(queryBody, queryArray);
    if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            error: 'Invalid query',
        });
    } else {
        return { reviews: rows, count: reviewCount };
    }
};

exports.fetchCommentsByReviewId = async (id, queries) => {
    const { limit, p } = queries;

    const { LIMIT, OFFSET } = limitOffset(limit, p);

    await validate.id(id);

    const queryBody = `
                SELECT review_id,comment_id, votes, created_at, username, body FROM comments
                JOIN users
                ON users.username = comments.author
                WHERE review_id = $1
                LIMIT $2 OFFSET $3;`;
    const { rows } = await db.query(queryBody, [id, LIMIT, OFFSET]);

    const body = await db.query(
        `SELECT title FROM reviews WHERE review_id = $1`,
        [id]
    );

    if (body.rows.length !== 0 && rows.length === 0) {
        return rows;
    }

    return rows.length !== 0
        ? rows
        : Promise.reject({
              status: 404,
              error: 'Invalid query',
          });
};

exports.addCommentToReview = async (id, { username, body }) => {
    await validate.addComment(username, body);
    await validate.id(id);
    const queryBody = `INSERT INTO comments(author, review_id, created_at, body)
    VALUES ($1,$2,$3,$4)
    RETURNING *;`;

    const user_test = await db.query(
        `SELECT username FROM users WHERE username = $1`,
        [username]
    );

    if (user_test.rows.length === 0) {
        return Promise.reject({
            status: 404,
            error: 'username does not exist',
        });
    }

    const { rows } = await db.query(queryBody, [
        username,
        id,
        new Date(),
        body,
    ]);

    return rows[0];
};

exports.addReview = async ({
    owner,
    title,
    review_body,
    designer,
    category,
}) => {
    const inputVariables = [title, review_body, designer, category, owner];
    for (i = 0; i < inputVariables.length; i++) {
        if (!inputVariables[i] || typeof inputVariables[i] !== 'string')
            return Promise.reject({
                status: 400,
                error: 'invalid key name or value',
            });
    }

    const queryBody = `INSERT INTO reviews 
        (title, review_body, designer ,category ,owner , created_at ) 
        VALUES 
        ($1,$2,$3,$4,$5,CURRENT_TIMESTAMP )
        RETURNING *;`;

    const { rows } = await db.query(queryBody, inputVariables);

    return rows[0];
};

exports.removeReview = async (id) => {
    await validate.id(id);
    const queryBody = `DELETE FROM reviews WHERE review_id = $1 RETURNING *;`;
    const { rows } = await db.query(queryBody, [id]);
    if (rows.length === 0) {
        return Promise.reject({
            status: 400,
            error: 'No reviews with this ID',
        });
    }
};
