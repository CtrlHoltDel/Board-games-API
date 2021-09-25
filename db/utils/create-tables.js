const db = require('../connection');

exports.dropTables = async () => {
    const tables = ['comments', 'reviews', 'categories', 'users'];

    for (let i = 0; i < tables.length; i++) {
        await db.query(`DROP TABLE IF EXISTS ${tables[i]};`);
    }
};

exports.createTables = async () => {
    const categoriesTable = `CREATE TABLE categories (
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
        );`;
    const usersTable = `CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        avatar_url VARCHAR(255),
        name VARCHAR
        );`;
    const reviewsTable = `CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        review_body VARCHAR(1000) NOT NULL, 
        designer VARCHAR(80) NOT NULL,
        review_img_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR NOT NULL REFERENCES categories(slug),
        owner VARCHAR NOT NULL REFERENCES users(username),
        created_at TIMESTAMP DEFAULT NOW()
        );`;
    const commentsTable = `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR REFERENCES users(username),
        review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
        votes INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        body VARCHAR(1000)
    );
    `;

    const tables = [categoriesTable, usersTable, reviewsTable, commentsTable];

    for (let i = 0; i < tables.length; i++) {
        await db.query(tables[i]);
    }
};
