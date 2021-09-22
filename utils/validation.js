const validate = {};

validate.allReviews = (queries) => {
    const queriesWhitelist = ['sort_by', 'order', 'category'];
    const currentKeys = Object.keys(queries);
    const rejectObject = {
        status: 400,
        endpoint: '/api/reviews?category=query',
        error: {
            valid_queries: ['sort_by', 'order', 'category'],
        },
    };

    for (let i = 0; i < currentKeys.length; i++) {
        const key = currentKeys[i];
        if (queriesWhitelist.indexOf(key) === -1) {
            return Promise.reject(rejectObject);
        }
        if (key === 'order') {
            queries[key] = queries[key].toLowerCase();
            if (!(queries[key] === 'asc' || queries[key] === 'desc')) {
                return Promise.reject(rejectObject);
            }
        }
    }
};

validate.voteIncrementer = (object, endpoint) => {
    if (
        typeof object.inc_votes !== 'number' ||
        Object.keys(object).length !== 1
    ) {
        return Promise.reject({
            status: 400,
            endpoint: endpoint,
            error: 'format to { inc_votes : number }',
        });
    }
};

validate.sortBy = (object) => {
    const validColumns = [
        'owner',
        'title',
        'review_id',
        'category',
        'votes',
        'amount_of_comments',
        'created_at',
    ];

    if (validColumns.indexOf(object) === -1) {
        return Promise.reject({
            status: 404,
            endpoint: '/api/reviews?sort_by=column_to_sort_by',
            error: {
                invalid_column: object,
                valid_columns: [
                    'owner',
                    'title',
                    'review_id',
                    'category',
                    'votes',
                    'comment_count',
                ],
            },
        });
    }
};

validate.addComment = (username, body) => {
    if (typeof username !== 'string' || typeof body !== 'string') {
        return Promise.reject({
            status: 400,
            endpoint: '/api/reviews/:id/comments',
            valid_format: `{ username: string, body: string}`,
        });
    }
};

validate.id = (id, endpoint) => {
    if (!Number(id)) {
        return Promise.reject({
            status: 404,
            endpoint: endpoint,
            error: 'id must be a number',
        });
    }
};

module.exports = validate;
