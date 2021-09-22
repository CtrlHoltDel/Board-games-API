const db = require('../db/connection');
const validate = require('../utils/validation');

exports.removeCommentById = async (id) => {
    await validate.id(id, '/api/comments/comment_id');

    const { rows } = await db.query(
        `SELECT * FROM comments WHERE comment_id = $1`,
        [id]
    );

    if (rows.length === 0)
        return Promise.reject({
            status: 400,
            error: `No comment with an id of ${id}`,
            endpoint: '/api/comments/comment_id',
        });

    const query_body = `DELETE FROM comments WHERE comment_id = $1;`;
    await db.query(query_body, [id]);
};

exports.amendVotesById = async (comment, id) => {
    await validate.id(id, '/api/comments/comment_id');
    await validate.voteIncrementer(comment, '/api/comments/comment_id');

    const query_body = `
    UPDATE comments
    SET votes = votes + ${comment.inc_votes}
    WHERE comment_id = $1
    RETURNING *;
    `;

    const { rows } = await db.query(query_body, [id]);

    return rows[0];
};
