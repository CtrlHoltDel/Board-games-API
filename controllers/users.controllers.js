const { fetchAllUsers, fetchSingleUser } = require('../models/users.models');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchAllUsers();
        res.status(200).send({ users });
    } catch (err) {
        next(err);
    }
};

exports.getSingleUser = async (req, res, next) => {
    const { username } = req.params;
    try {
        const user = await fetchSingleUser(username);
        res.status(200).send({ user });
    } catch (err) {
        next(err);
    }
};
