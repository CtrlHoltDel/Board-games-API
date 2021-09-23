const validate = require('./validation');

exports.limitOffset = (limit, p) => {
    let LIMIT = limit || 10;
    let OFFSET = p ? (p - 1) * LIMIT : 0;
    return { LIMIT, OFFSET };
};

//Check for SQL injection issues - everything should be filtered
exports.buildReviewQuery = async (queries) => {
    const { order, sort_by, category } = queries;
    let WHERE = '';
    let SORT_BY = 'review_id';

    if (category) {
        let category = queries.category.replace('_', ' ');
        WHERE = ` WHERE category = '${category}'`;
    }

    let ORDER = order ? order : 'desc';

    if (sort_by) {
        await validate.sortBy(sort_by);
        SORT_BY = sort_by === '' ? 'created_at' : sort_by;
    }

    const queryBody = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(body) amount_of_comments FROM comments
    FULL OUTER JOIN reviews
    ON comments.review_id = reviews.review_id
    ${WHERE}
    GROUP BY title, owner, reviews.review_id
    ORDER BY ${SORT_BY} ${ORDER}
    LIMIT $1 OFFSET $2
    ;`;

    return { WHERE, queryBody };
};
