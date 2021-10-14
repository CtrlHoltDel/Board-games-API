exports.checkId = (id) => {
  if (!Number(id)) {
    return Promise.reject({ status: 400, message: 'Bad request' });
  }
};

exports.validateBody = (queries, ...validKeys) => {
  const rejectObject = { status: 400, message: 'Invalid body' };
  const validKeyNames = validKeys.map((keys) => keys[0]);

  for (let key in queries) {
    if (!validKeyNames.includes(key)) return Promise.reject(rejectObject);
  }

  for (let i = 0; i < validKeys.length; i++) {
    const [validKey, dataType] = validKeys[i];
    if (typeof queries[validKey] !== dataType) {
      return Promise.reject(rejectObject);
    }
  }
};

exports.validatePagination = (limit, p) => {
  if (
    !Number(limit) ||
    (!Number(p) && Number(p) !== 0) ||
    limit % 1 !== 0 ||
    p % 1 !== 0
  ) {
    return Promise.reject({ status: 400, message: 'Invalid query' });
  }
};

exports.validateQueryValues = async ({
  sort_by = 'votes',
  order = 'desc',
  limit = 10,
  p = 0,
}) => {
  const validColumns = ['votes', 'category', 'comment_count', 'created_at'];
  const validOrder = ['asc', 'ASC', 'desc', 'DESC'];

  await this.validatePagination(limit, p);

  if (!validColumns.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: 'Invalid query' });
  }
};

exports.validateQueryFields = (queries, greenList) => {
  const objectKeys = Object.keys(queries);

  for (let i = 0; i < objectKeys.length; i++) {
    if (!greenList.includes(objectKeys[i])) {
      return Promise.reject({ status: 404, message: 'Bad request' });
    }
  }
};
