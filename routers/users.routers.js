const {
    getAllUsers,
    getSingleUser,
} = require('../controllers/users.controllers');

const usersRouter = require('express').Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:username', getSingleUser);

module.exports = usersRouter;
