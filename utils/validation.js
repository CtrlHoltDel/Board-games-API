exports.checkId = (id) => {
  if (!Number(id)) {
    return Promise.reject({ status: 400, message: 'Bad request' });
  }
};

exports.checkDb = () => {};
