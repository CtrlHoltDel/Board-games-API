\c nc_games_test;

-- DROP TABLE IF EXISTS comments;
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS users;



\echo '\n CATEGORIES'
SELECT * FROM categories;
\echo '\n USERS'
SELECT * FROM users;
\echo '\n REVIEWS'
SELECT * FROM reviews;
\echo '\n COMMENTS'
SELECT * FROM comments;


        SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(body) amount_of_comments FROM comments
        FULL OUTER JOIN reviews
        ON comments.review_id = reviews.review_id
        
        GROUP BY title, owner, reviews.review_id
         ORDER BY reviews.review_id desc
        LIMIT 10 OFFSET 3
;
