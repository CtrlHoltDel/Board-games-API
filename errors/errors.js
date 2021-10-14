exports.invalidEndpoint = (req, res) => {
  res.status(404).send({ error: { message: 'Not found' } });
};

exports.customError = (error, req, res, next) => {
  if (error.status === 400 || error.status === 404) {
    res.status(error.status).send({ error });
  } else {
    next(error);
  }
};

exports.serverError = (err, req, res, next) => {
  console.log(err, '<< Uncaught error');
  res.status(500);
};

// module.exports = { invalidEndpoint };
