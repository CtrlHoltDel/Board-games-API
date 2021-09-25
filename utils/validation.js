const validate = {};

validate.allReviews = (queries) => {
    //Check if there's an invalid query.
    //Check if limit and p are just numbers
    //check if order is either asc/desc

    const validQueries = ['sort_by', 'order', 'category', 'limit', 'p'];
    const rejectObject = {
        status: 400,
        error: {
            valid_queries: validQueries,
        },
    };

    const keys = Object.keys(queries);

    for (let i = 0; i < keys.length; i++) {
        if (validQueries.indexOf(keys[i]) === -1)
            return Promise.reject(rejectObject);
    }

    let { limit, order, p } = queries;

    if ((limit && !Number(limit)) || (p && !Number(p))) {
        return Promise.reject(rejectObject);
    }

    if (order) {
        order = order.toLowerCase();
        if (order !== 'asc' && order !== 'desc')
            return Promise.reject(rejectObject);
    }
};

validate.voteUpdater = (object) => {
    if (
        typeof object.inc_votes !== 'number' ||
        Object.keys(object).length !== 1
    ) {
        return Promise.reject({
            status: 400,
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
            error: {
                invalid_column: object,
                valid_columns: [...validColumns.slice(0, 5), 'comment_count'],
            },
        });
    }
};

validate.addComment = (username, body) => {
    if (typeof username !== 'string' || typeof body !== 'string') {
        return Promise.reject({
            status: 400,
            valid_format: `{ username: string, body: string}`,
        });
    }
};

validate.id = (id) => {
    if (!Number(id)) {
        return Promise.reject({
            status: 400,
            error: 'id must be a number',
        });
    }
};

module.exports = validate;
