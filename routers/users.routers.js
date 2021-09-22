const usersRouter = require('express').Router();

usersRouter.get('/', (req, res) => {
    console.log('test');
});

module.exports = usersRouter;
