const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', (req, res) => {
    const { params } = req;
    console.log(params);
});

module.exports = commentsRouter;
