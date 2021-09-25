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
        objectToArray(categoryData, 'category')
    );

    const usersQuery = format(
        `INSERT INTO users (username, name, avatar_url) 
         VALUES %L;`,
        objectToArray(userData, 'users')
    );

    const reviewsQuery = format(
        `INSERT INTO reviews 
        (title, designer, owner, review_img_url, review_body, category, created_at, votes)
        VALUES %L;`,
        objectToArray(reviewData, 'reviews')
    );

    const commentsQuery = format(
        `INSERT INTO comments
        (body, votes, author, review_id, created_at )
        VALUES %L`,
        objectToArray(commentData, 'comments')
    );

    await db.query(categoryQuery);
    await db.query(usersQuery);
    await db.query(reviewsQuery);
    await db.query(commentsQuery);
};
