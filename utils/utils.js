const db = require('../db/connection');
const validate = require('./validation');

exports.limitOffset = (limit, p) => {
    let LIMIT = limit || 10;
    let OFFSET = p ? (p - 1) * LIMIT : 0;
    return { LIMIT, OFFSET };
};

exports.buildReviewQuery = async (queries) => {
    const { order, sort_by, category } = queries;

    let WHERE = '';
    let SORT_BY = 'created_at';
    let cat = undefined;

    if (category) {
        cat = queries.category.replace('_', ' ');
        WHERE = ` WHERE category = $3`;
    }

    let ORDER = order ? order : 'desc';

    if (sort_by) {
        await validate.sortBy(sort_by);
        SORT_BY = sort_by === '' ? 'created_at' : sort_by;
    }

    const queryBody = `
    SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.body) AS comment_count FROM comments
    RIGHT JOIN reviews
    ON comments.review_id = reviews.review_id
    ${WHERE}
    GROUP BY title, owner, reviews.review_id
    ORDER BY ${SORT_BY} ${ORDER}
    LIMIT $1 OFFSET $2
    ;`;

    return { WHERE, queryBody, cat };
};

exports.amountOfReviews = async (category) => {
    if (!category) {
        const allResults = await db.query(`SELECT COUNT(*) from reviews`);
        return allResults.rows[0].count;
    } else {
        const allResults = await db.query(
            `SELECT COUNT(*) from reviews WHERE category = $1`,
            [category]
        );
        return allResults.rows[0].count;
    }
};
