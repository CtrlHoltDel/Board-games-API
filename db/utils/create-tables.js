const db = require('../connection');

exports.dropTables = async () => {
  const tables = ['review_likes', 'comments', 'reviews', 'categories', 'users'];

  for (let i = 0; i < tables.length; i++) {
    await db.query(`DROP TABLE IF EXISTS ${tables[i]};`);
  }
};

exports.createTables = async () => {
  const categories = `CREATE TABLE categories (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`;

  const users = `CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    avatar_url VARCHAR(255),
    name VARCHAR
  );`;

  const reviews = `CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    review_body VARCHAR(1000) NOT NULL, 
    designer VARCHAR(80) NOT NULL,
    review_img_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    votes INT DEFAULT 0,
    category VARCHAR NOT NULL REFERENCES categories(slug) ON DELETE CASCADE,
    owner VARCHAR NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
  );`;

  const comments = `CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
    review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
    votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    body VARCHAR(1000) NOT NULL
  );`;

  const reviewLikes = `CREATE TABLE review_likes (
    rl_p_key SERIAL PRIMARY KEY,
    username VARCHAR REFERENCES users(username) ON DELETE CASCADE,
    review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE
  );
  
  ALTER TABLE review_likes
  ADD CONSTRAINT unique_user_like UNIQUE (username, review_id)`;

  const tables = [categories, users, reviews, comments, reviewLikes];

  for (let i = 0; i < tables.length; i++) {
    await db.query(tables[i]);
  }
};
