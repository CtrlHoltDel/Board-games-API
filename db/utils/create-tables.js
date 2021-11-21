const db = require("../connection");

exports.dropTables = async () => {
  const tables = [
    "review_likes",
    "review_votes",
    "comments",
    "reviews",
    "categories",
    "users",
  ];

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
    avatar_url VARCHAR(255) DEFAULT 'https://media.istockphoto.com/vectors/default-placeholder-profile-icon-vector-id666545148?k=6&m=666545148&s=170667a&w=0&h=ycJvJHz6ZMWsErum0XpjVabgZsP8dib2feSIJ5dIWYk=',
    name VARCHAR DEFAULT 'Anon',
    id VARCHAR NOT NULL,
    created TIMESTAMP DEFAULT NOW() NOT NULL
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
    votes INT DEFAULT 0 ,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    body VARCHAR(1000) NOT NULL
  );`;

  const reviewLikes = `CREATE TABLE review_likes (
    rl_p_key SERIAL PRIMARY KEY,
    username VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
    review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
    liked_at TIMESTAMP DEFAULT NOW() NOT NULL
  );
  
  ALTER TABLE review_likes
  ADD CONSTRAINT unique_user_like UNIQUE (username, review_id)`;

  const reviewVotes = `CREATE TABLE review_votes (
    rv_key SERIAL PRIMARY KEY,
    username VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
    review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
    vote_status INT DEFAULT 0
  );
  
  ALTER TABLE review_votes
  ADD CONSTRAINT unique_user_vote UNIQUE (username, review_id)`;

  const tables = [
    categories,
    users,
    reviews,
    reviewVotes,
    comments,
    reviewLikes,
  ];

  for (let i = 0; i < tables.length; i++) {
    await db.query(tables[i]);
  }
};
