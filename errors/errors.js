exports.missingPath = (req, res) => {
    res.status(404).send({ error: 'route not found' });
};

exports.customError = (error, req, res, next) => {
    error.status === 400 || error.status === 404
        ? res.status(error.status).send({ error })
        : next(error);
};

exports.pgErrors = (error, req, res, next) => {
    if (error.code === '22P02') {
        res.status(400).send({ error: 'Error when accessing database' });
    } else if (error.code === '23503') {
        res.status(400).send({ error: "User doesn't exist" });
    } else {
        next(error);
    }
};

exports.serverError = (error, req, res, next) => {
    console.log(`${error} << Uncaught error`);
    res.status(500).send({ error });
};
