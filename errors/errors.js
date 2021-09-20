exports.missingPath = (req, res, next) => {
    res.status(404).send({ error: 'route not found' });
};

exports.error400 = (error, req, res, next) => {
    res.status(400).send({ error });
};
