const {
    deleteCommentById,
    patchVotesById,
} = require('../controllers/comments.controller');

const commentsRouter = require('express').Router();

commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentById)
    .patch(patchVotesById);

module.exports = commentsRouter;
