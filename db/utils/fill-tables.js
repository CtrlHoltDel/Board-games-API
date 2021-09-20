const db = require('../connection');
const format = require('pg-format');

exports.fillTables = async ({
    categoryData,
    commentData,
    reviewData,
    userData,
}) => {
    const categoryArray = categoryData.map(({ slug, description }) => [
        slug,
        description,
    ]);

    const usersArray = userData.map(({ username, name, avatar_url }) => [
        username,
        avatar_url,
        name,
    ]);

    const reviewsArray = reviewData.map(
        ({
            title,
            designer,
            owner,
            review_img_url,
            review_body,
            category,
            created_at,
            votes,
        }) => [
            title,
            review_body,
            designer,
            review_img_url,
            votes,
            category,
            owner,
            created_at,
        ]
    );

    const commentsArray = commentData.map(
        ({ body, votes, author, review_id, created_at }) => [
            author,
            review_id,
            votes,
            created_at,
            body,
        ]
    );

    const categoryQuery = format(
        `INSERT INTO categories (slug, description)
         VALUES %L `,
        categoryArray
    );

    const usersQuery = format(
        `INSERT INTO users (username, avatar_url, name) 
         VALUES %L;`,
        usersArray
    );

    const reviewsQuery = format(
        `INSERT INTO reviews 
        (title, review_body, designer, review_img_url, votes, category, owner, created_at)
        VALUES %L;`,
        reviewsArray
    );

    const commentsQuery = format(
        `INSERT INTO comments
        (author, article_id, votes, created_at,  body)
        VALUES %L`,
        commentsArray
    );

    await db.query(categoryQuery);
    await db.query(usersQuery);
    await db.query(reviewsQuery);
    await db.query(commentsQuery);
};
