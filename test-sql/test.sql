
-- //Table names
-- //categories
-- //reviews
-- //users
-- //comments

-- DROP TABLE IF EXISTS comments;

-- DROP TABLE IF EXISTS commnts;
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS users;

-- CREATE TABLE categories (
--     slug VARCHAR PRIMARY KEY,
--     description VARCHAR
--     );

-- CREATE TABLE users (
--     username VARCHAR PRIMARY KEY,
--     avatar_url VARCHAR(255),
--     name VARCHAR
-- );

-- CREATE TABLE reviews (
--     review_id SERIAL PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     review_body VARCHAR(1000) NOT NULL, 
--     designer VARCHAR(80) NOT NULL,
--     review_img_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
--     votes INT DEFAULT 0,
--     category VARCHAR NOT NULL REFERENCES categories(slug),
--     owner VARCHAR NOT NULL REFERENCES users(username),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE comments (
--     comment_id SERIAL PRIMARY KEY,
--     author VARCHAR REFERENCES users(username),
--     review_id INT REFERENCES reviews(review_id),
--     votes INT DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     body VARCHAR(255)
-- );

-- INSERT INTO categories (slug, description)
-- VALUES ('action', 'action stations are go');

-- INSERT INTO users (username, avatar_url, name) 
-- VALUES ('ctrlholtdel', 'http://', 'ryan');

-- INSERT INTO reviews 
-- (title, review_body, designer, review_img_url, votes, category, owner)
-- VALUES
-- ('Agricola', 'Farmyard fun!', 'Uwe Rosenberg', 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', 11, 'action', 'ctrlholtdel');

-- INSERT INTO comments
-- (author, review_id, votes,  body)
-- VALUES
-- ('ctrlholtdel', 1, 34, 'here are my comments about this review');