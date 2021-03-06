const {
  fetchUsers,
  fetchUser,
  addUser,
  fetchUserLikes,
  amendUser,
  fetchUserComments,
  fetchUserReviews,
  removeUser,
  fetchUserInteractionByReview,
} = require("../models/users.models");

exports.getUsers = async (req, res, next) => {
  const { query } = req;
  try {
    const { users, count } = await fetchUsers(query);
    res.status(200).send({ users, count });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await fetchUser(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  const { body } = req;
  try {
    const user = await addUser(body);
    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserLikes = async (req, res, next) => {
  const { username } = req.params;
  const { query } = req;

  try {
    const object = await fetchUserLikes(username, query);
    res.status(200).send(object);
  } catch (err) {
    next(err);
  }
};

exports.getUserComments = async (req, res, next) => {
  const { username } = req.params;
  const { query } = req;

  try {
    const comments = await fetchUserComments(username, query);
    res.status(200).send(comments);
  } catch (err) {
    next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  const { username } = req.params;
  const { body } = req;

  try {
    const user = await amendUser(username, body);

    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    await removeUser(username);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getUserInteractionByReview = async (req, res, next) => {
  const { username, review_id } = req.params;

  try {
    const liked = await fetchUserInteractionByReview(username, review_id);
    res.status(200).send(liked);
  } catch (err) {
    next(err);
  }
};
