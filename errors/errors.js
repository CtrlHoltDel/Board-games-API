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
        let error_info;
        let error_char = error.detail
            .match(/=\([a-zA-Z0-9-]+\)/g)[0]
            .slice(2, -1);

        error_info = /users/g.test(error.detail)
            ? `User [${error_char}] doesn't exist`
            : `Review with the ID [${error_char}] doesn't exist`;

        res.status(400).send({ error: error_info });
    } else {
        next(error);
    }
};

exports.serverError = (error, req, res, next) => {
    console.log(`${error} << Uncaught error`);
    res.status(500).send({ error });
};
