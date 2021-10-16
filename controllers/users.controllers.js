const {
  fetchUsers,
  fetchUser,
  addUser,
  fetchUserLikes,
} = require('../models/users.models');

exports.getUsers = async (req, res, next) => {
  const { query } = req;
  try {
    const users = await fetchUsers(query);
    res.status(200).send({ users });
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
