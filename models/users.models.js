const format = require("pg-format");
const db = require("../db/connection");
const { pullList, insertItem, pullCount } = require("../utils/utils");
const {
  validateBody,

  validatePagination,
  validateUser,
  validateReview,
  checkId,
  validateQueryValues,
  validateOrder,
} = require("../utils/validation");

exports.fetchUsers = async (query) => {
  let { limit = 10, p = 0, search = "%%", order = "desc" } = query;

  if (+p) p = limit * (p - 1);

  await validatePagination(limit, p);
  await validateOrder(order);

  const { rows } = await db.query(
    `SELECT COUNT(username) FROM users WHERE username iLike $1;`,
    [`%${search}%`]
  );

  const { rows: users } = await db.query(
    `SELECT * FROM users WHERE username iLIKE $1 ORDER BY created ${order} LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, p]
  );

  return { users, count: rows[0].count };
};

exports.fetchUser = async (username) => {
  const user = await pullList("users", "username", username);
  const comments = await pullCount("author", "comments", "author", username);
  const reviews = await pullCount("owner", "reviews", "owner", username);
  const likes = await pullCount(
    "username",
    "review_likes",
    "username",
    username
  );

  if (!user.length) {
    return Promise.reject({ status: 404, message: "Non-existent user" });
  }

  return { ...user[0], comments, reviews, likes };
};

exports.fetchUserLikes = async (username, queries) => {
  let { order = "desc", limit = 10, p = 0 } = queries;

  await validatePagination(limit, p);
  await validateOrder(order);
  await validateUser(username);

  if (+p) p = limit * (p - 1);

  const queryBody = `
    SELECT * FROM review_likes JOIN reviews ON reviews.review_id = review_likes.review_id
    WHERE username = $1
    ORDER BY liked_at ${order}
    LIMIT $2 OFFSET $3;
  `;

  const { rows } = await db.query(queryBody, [username, limit, p]);

  const count = await pullCount(
    "review_id",
    "review_likes",
    "username",
    username
  );

  return { reviews: rows, count };
};

exports.fetchUserComments = async (username, queries) => {
  let { limit = 10, p = 0 } = queries;

  await validatePagination(limit, p);
  await validateUser(username);

  if (+p) p = limit * (p - 1);

  const { rows } = await db.query(
    `SELECT comment_id, author, comments.review_id, comments.votes, comments.body, reviews.title, comments.created_at FROM comments
  JOIN reviews ON comments.review_id = reviews.review_id
  WHERE author = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,

    [username, limit, p]
  );

  const count = await pullCount("author", "comments", "author", username);

  return { comments: rows, count };
};

exports.addUser = async (queries) => {
  const { username, avatar_url = "", name = "", id = "" } = queries;

  await validateBody(
    { username, avatar_url, name },
    ["username", "string"],
    ["avatar_url", "string"],
    ["name", "string"]
  );

  const rows = ["username", "id"];
  const values = [username, id];

  if (avatar_url) {
    rows.push("avatar_url");
    values.push(avatar_url);
  }

  if (name) {
    rows.push("name");
    values.push(name);
  }

  const user = await insertItem("users", rows, values);

  return user;
};

exports.amendUser = async (username, body) => {
  await validateUser(username);
  await validateBody(body, ["avatar_url", "string"], ["name", "string"]);
  const { avatar_url, name } = body;
  const queryBody = `
    UPDATE users
    SET avatar_url = $1, name = $2
    WHERE username = $3 RETURNING *
    `;

  const { rows } = await db.query(queryBody, [avatar_url, name, username]);

  return rows;
};

exports.removeUser = async (username) => {
  const queryBody = format(`DELETE from USERS where username = %L`, username);
  await db.query(queryBody);
};

exports.fetchUserInteractionByReview = async (username, reviewId) => {
  await checkId(reviewId);
  await validateUser(username);
  await validateReview(reviewId);

  const { rows } = await db.query(
    `SELECT * FROM review_likes WHERE username = $1 AND review_id = $2`,
    [username, reviewId]
  );

  const { rows: votedResult } = await db.query(
    `SELECT * FROM review_votes WHERE username = $1 AND review_id = $2`,
    [username, reviewId]
  );

  let voted = !votedResult[0] ? 0 : votedResult[0].vote_status;

  return { liked: !!rows.length, voted };
};
