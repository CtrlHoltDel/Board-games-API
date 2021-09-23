exports.missingPath = (req, res) => {
    res.status(404).send({ error: 'route not found' });
};

exports.customError = (error, req, res, next) => {
    error.status === 400 || error.status === 404
        ? res.status(error.status).send({ error })
        : next(error);
};

exports.pgErrors = (error, req, res, next) => {
    if (error.code === '23503') {
        let invalidQuery = error.detail.match(/\(\w+\)/)[0].slice(1, -1);
        if (invalidQuery === 'author') invalidQuery = 'owner';
        res.status(400).send({ error: `Invalid ${invalidQuery}` });
    } else {
        next(error);
    }
};

exports.serverError = (error, req, res, next) => {
    console.log(`${error} << Uncaught error`);
    res.status(500).send({ error });
};
