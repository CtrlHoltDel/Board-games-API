const db = require('../db/connection');
const validate = require('../utils/validation');

exports.removeCommentById = async (id) => {
    await validate.id(id);

    const { rows } = await db.query(
        `SELECT * FROM comments WHERE comment_id = $1`,
        [id]
    );

    if (rows.length === 0)
        return Promise.reject({
            status: 404,
            error: `No comment with an id of ${id}`,
        });

    const query_body = `DELETE FROM comments WHERE comment_id = $1;`;
    await db.query(query_body, [id]);
};

// const amendBodyById = async (id, edit) => {
//     const query = `
//         UPDATE reviews
//         SET review_body = $1
//         WHERE review_id = $2
//         RETURNING *;
//         `;

//     const { rows } = await db.query(query, [edit, id]);

//     return rows[0];
// };

const amendVoteById = async (id, comment) => {
    const query_body = `
    UPDATE comments
    SET votes = votes + ${comment.inc_votes}
    WHERE comment_id = $1
    RETURNING *;
    `;

    const { rows } = await db.query(query_body, [id]);

    if (rows.length === 0) {
        return Promise.reject({ status: 404, error: 'non existent comment' });
    }

    return rows[0];
};

const amendBodyById = async (id, comment) => {
    const query = `
            UPDATE comments
            SET body = $1
            WHERE comment_id = $2
            RETURNING *;
            `;

    const { rows } = await db.query(query, [comment, id]);

    return rows[0];
};

exports.amendComment = async (comment, id) => {
    await validate.id(id);
    await validate.bodyPatch(comment);

    if (comment.inc_votes !== undefined) {
        return await amendVoteById(id, comment);
    } else if (comment.edit !== undefined) {
        return await amendBodyById(id, comment);
    }
};
