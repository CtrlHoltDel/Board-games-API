const {
  insertItem,
  pullList,
  deleteFromDb,
  updateVote,
  updateBody,
} = require('../utils/utils');
const { checkId, validateBody } = require('../utils/validation');

exports.insertComment = async (reviewId, input) => {
  await checkId(reviewId);
  const reviewCheck = await pullList('reviews', 'review_id', reviewId);

  const { username, body } = input;

  await validateBody(
    { username, body },
    ['username', 'string'],
    ['body', 'string']
  );

  if (!reviewCheck[0]) {
    return Promise.reject({ status: 404, message: 'Non-existent review' });
  }

  const comment = await insertItem(
    'comments',
    ['author', 'body', 'review_id'],
    [username, body, reviewId]
  );

  return comment;
};

exports.removeComment = async (commentId) => {
  await checkId(commentId);

  const comment = await pullList('comments', 'comment_id', commentId);

  if (!comment[0]) {
    return Promise.reject({ status: 404, message: 'Non-existent comment' });
  }

  await deleteFromDb('comments', 'comment_id', commentId);
};

exports.amendCommentVote = async (commentId, queries) => {
  await checkId(commentId);
  await validateBody(queries, ['inc_votes', 'number']);

  const { inc_votes } = queries;

  const comment = await updateVote(
    'comments',
    inc_votes,
    'comment_id',
    commentId
  );

  if (!comment)
    return Promise.reject({ status: 404, message: 'Non-existent comment' });

  return comment;
};

exports.amendCommentBody = async (commentId, queries) => {
  await checkId(commentId);
  await validateBody(queries, ['body', 'string']);

  const commentTest = await pullList('comments', 'comment_id', commentId);
  if (!commentTest[0])
    return Promise.reject({ status: 404, message: 'Non-existent comment' });

  const { body } = queries;

  const comment = await updateBody(
    'comments',
    'body',
    body,
    'comment_id',
    commentId
  );

  return comment[0];
};
