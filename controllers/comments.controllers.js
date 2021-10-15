const { insertComment, removeComment } = require('../models/comments.models');

exports.postComment = async (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  try {
    const comment = await insertComment(review_id, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.delComment = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await removeComment(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
