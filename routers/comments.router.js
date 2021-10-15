const {
  delComment,
  patchComment,
} = require('../controllers/comments.controllers');

const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id').delete(delComment).patch(patchComment);

module.exports = commentsRouter;
