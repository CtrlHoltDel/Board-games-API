exports.missingPath = (req, res, next) => {
    res.status(404).send({ error: 'route not found' });
};

exports.error400 = (error, req, res, next) => {
    if (error.status === 400 || error.status === 404) {
        res.status(error.status).send({ error });
    } else {
        console.log(error);
        next(error);
    }
};

exports.pgErrors = (error, req, res, next) => {
    if (error.code === '22P02') {
        res.status(400).send({ error: 'Error when accessing database' });
    } else {
        next(error);
    }
};

exports.serverError = (error, req, res, next) => {
    console.log(`${error} << Uncaught error`);
    res.status(500).send({ error });
};
