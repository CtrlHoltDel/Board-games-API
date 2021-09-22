const db = require('../db/connection');

exports.removeCommentById = async (id) => {
    if (!Number(id))
        return Promise.reject({
            status: 404,
            endpoint: '/api/comments/comment_id',
            error: 'id must be a number',
        });

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
