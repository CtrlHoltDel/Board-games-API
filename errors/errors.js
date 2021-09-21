exports.missingPath = (req, res, next) => {
    res.status(404).send({ error: 'route not found' });
};

exports.error400 = (error, req, res, next) => {
    if (error.status === 400 || error.status === 404) {
        res.status(error.status).send({ error });
    } else {
        next();
    }
};

exports.serverError = (error, req, res, next) => {
    console.log(`${error} << Uncaught error`);
    res.status(500).send({ error });
};
