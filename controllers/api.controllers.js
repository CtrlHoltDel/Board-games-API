exports.listOfAPIs = (req, res) => {
    const endpoints = {
        GET: {
            '/api': { description: 'Returns a full list of endpoints' },
            '/api/categories': {
                description: 'Returns a full list of categories',
            },
            '/api/reviews': {
                description: 'Returns a full list of reviews',
                queries: {
                    '?sort_by=:category': 'return reviews sorted by categories',
                    '?order=': 'sort by either ASC/DESC',
                    '?category=:category':
                        'Filters all items by a specific category',
                },
            },
            '/api/reviews/:review_id/comments': {
                description:
                    'Returns a full list of comments based upon the passed review ID',
            },
            '/api/users': {
                description: 'Returns an array of a full list of users',
            },
            '/api/users/:username': {
                description:
                    'Responds with a specified user containing username/avatar_url and name',
            },
        },
        PATCH: {
            '/api/reviews/:review_id': {
                description:
                    'Changes the amount of votes on a specified review',
                valid_body: '{ inc_votes : number }',
            },
            ' /api/comments/:comment_id': {
                description:
                    'Changes the amount of votes on a specified comment',
                valid_body: '{ inc_votes : number }',
            },
        },
        POST: {
            '/api/reviews/:review_id/comments': {
                description:
                    'Adds a comment to a review based upon passed user id',
                valid_body: `{ username: 'string', body: 'STRING'}`,
            },
        },
        DELETE: {
            '/api/comments/:comment_id': {
                description: 'Deletes a comment based upon given ID',
            },
        },
    };
    res.status(200).send({ endpoints });
};
