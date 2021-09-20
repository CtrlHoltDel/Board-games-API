\c nc_games_test;

-- DROP TABLE IF EXISTS comments;
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS users;




\echo '\n categories \n\n'
SELECT * FROM categories;
\echo '\n users \n\n'
SELECT * FROM users;
\echo '\n reviews \n\n'
SELECT * FROM reviews;
\echo '\n comments \n\n'
SELECT * FROM comments;


-- Query to get single review and amount of comments.

-- SELECT username AS owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, COUNT(comments.body) FROM users
-- JOIN reviews
-- ON users.username = reviews.owner
-- JOIN comments
-- ON comments.review_id = reviews.review_id
-- WHERE reviews.review_id = 3
-- GROUP BY username, title, reviews.review_id;