const {
    removeCommentById,
    amendVotesById,
} = require('../models/comments.models');

exports.deleteCommentById = async (req, res, next) => {
    const { comment_id } = req.params;

    try {
        await removeCommentById(comment_id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

exports.patchVotesById = async (req, res, next) => {
    const votes = req.body;
    const { comment_id } = req.params;
    try {
        const res = await amendVotesById(votes, comment_id);
    } catch (err) {
        next(err);
    }
};
