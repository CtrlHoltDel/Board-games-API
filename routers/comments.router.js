const {
  delComment,
  patchCommentVote,
  patchCommentBody,
} = require('../controllers/comments.controllers');

const commentsRouter = require('express').Router();

commentsRouter.route('/:comment_id').delete(delComment).patch(patchCommentVote);
commentsRouter.patch('/:comment_id/edit', patchCommentBody);

module.exports = commentsRouter;
