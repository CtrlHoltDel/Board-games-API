exports.invalidEndpoint = (req, res) => {
  res.status(404).send({ error: { message: "Not found" } });
};

exports.customError = (error, req, res, next) => {
  if (error.status === 400 || error.status === 404) {
    res.status(error.status).send({ error });
  } else {
    next(error);
  }
};

exports.psqlError = (err, req, res, next) => {
  if (err.code === "23505") {
    if (/username/g.test(err.detail)) {
      res.status(400).send({
        status: 400,
        message: "Username already exists",
      });
    }
  } else if (err.code === "23503") {
    if (/category/g.test(err.detail)) {
      res.status(400).send({
        status: 400,
        message: "Invalid category",
      });
    }
  } else {
    next(err);
  }
};

exports.serverError = (err, req, res, next) => {
  console.log(err, "<< Uncaught error");
  res.status(500);
};
