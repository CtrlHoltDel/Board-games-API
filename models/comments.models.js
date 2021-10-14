const { addItem, pullList } = require('../utils/utils');
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
    return Promise.reject({ status: 404, message: 'Non existent review' });
  }

  const comment = await addItem(
    'comments',
    ['author', 'body', 'review_id'],
    [username, body, reviewId]
  );

  return comment;
};
