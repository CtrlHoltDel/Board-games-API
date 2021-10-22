const {
  fetchUsers,
  fetchUser,
  addUser,
  fetchUserLikes,
  amendUser,
  fetchUserComments,
  fetchUserReviews,
} = require('../models/users.models');

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
    const reviews = await fetchUserLikes(username, query);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.getUserComments = async (req, res, next) => {
  const { username } = req.params;
  const { query } = req;

  try {
    const comments = await fetchUserComments(username, query);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.getUserReviews = async (req, res, next) => {
  const { username } = req.params;
  const { query } = req;

  try {
    const reviews = await fetchUserReviews(username, query);
    res.status(200).send({ reviews });
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
