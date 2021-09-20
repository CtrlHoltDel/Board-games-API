const db = require('../connection');
const format = require('pg-format');
const { objectToArray } = require('./data-manipulation');

exports.fillTables = async ({
    categoryData,
    commentData,
    reviewData,
    userData,
}) => {
    const categoryQuery = format(
        `INSERT INTO categories (slug, description)
         VALUES %L `,
        objectToArray(categoryData)
    );

    const usersQuery = format(
        `INSERT INTO users (username, avatar_url, name) 
         VALUES %L;`,
        objectToArray(userData)
    );

    const reviewsQuery = format(
        `INSERT INTO reviews 
        (title, designer, owner, review_img_url, review_body, category, created_at, votes)
        VALUES %L;`,
        objectToArray(reviewData)
    );

    const commentsQuery = format(
        `INSERT INTO comments
        (body, votes, author, article_id, created_at )
        VALUES %L`,
        objectToArray(commentData)
    );

    await db.query(categoryQuery);
    await db.query(usersQuery);
    await db.query(reviewsQuery);
    await db.query(commentsQuery);
};
