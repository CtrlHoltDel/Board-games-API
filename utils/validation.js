exports.checkId = (id) => {
  if (!Number(id)) {
    return Promise.reject({ status: 400, message: 'Bad request' });
  }
};

exports.checkDb = () => {};

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
