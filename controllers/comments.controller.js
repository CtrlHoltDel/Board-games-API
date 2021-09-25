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

exports.patchCommentVote = async (req, res, next) => {
    const votes = req.body;
    const { comment_id } = req.params;
    try {
        const comment = await amendVotesById(votes, comment_id);
        res.status(200).send({ comment });
    } catch (err) {
        next(err);
    }
};
