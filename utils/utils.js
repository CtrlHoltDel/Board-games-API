const validate = require('./validation');

exports.sqlToJsDate = (date) => {
    const [year, month, day] = [...date.slice(0, 10).split('-')];
    const dayTest = new Date(`${year}-${month}-${day}`);
    return dayTest;
};

exports.limitOffset = (limit, p) => {
    let LIMIT = limit || 10;
    let OFFSET = p ? (p - 1) * LIMIT : 0;
    return { LIMIT, OFFSET };
};

exports.buildReviewQuery = async (queries) => {
    const { order, sort_by, category } = queries;
    let ORDER = ` ORDER BY reviews.review_id desc`;
    let WHERE = '';

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

    const queryBody = `
    SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(body) amount_of_comments FROM comments
    FULL OUTER JOIN reviews
    ON comments.review_id = reviews.review_id
    ${WHERE}
    GROUP BY title, owner, reviews.review_id
    ${ORDER}
    LIMIT $1 OFFSET $2
    ;`;

    return { WHERE, queryBody };
};
