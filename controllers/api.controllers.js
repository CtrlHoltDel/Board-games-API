exports.listOfAPIs = (req, res) => {
    const endpoints = {
        GET: [
            '/api',
            '/api/categories',
            '/api/reviews',
            '/api/reviews/:review_id',
            '/api/reviews/:review_id/comments',
        ],
        PATCH: ['/api/reviews/:review_id'],
        POST: ['/api/reviews/:review_id/comments'],
    };
    res.status(200).send({ endpoints });
};
