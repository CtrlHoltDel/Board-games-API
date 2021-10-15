const { delComment } = require('../controllers/comments.controllers');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', delComment);

module.exports = commentsRouter;
