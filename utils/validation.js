const { rejPromise } = require('./utils');

exports.fetchAllReviewsValidate = (queries) => {
    const queriesWhitelist = ['sort_by', 'order', 'category'];
    const currentKeys = Object.keys(queries);
    // const rejectedPromise = rejPromise(400, '/api/reviews?category=query', {
    //     valid_queries: ['sort_by', 'order', 'category'],
    // });

    for (let i = 0; i < currentKeys.length; i++) {
        const key = currentKeys[i];
        if (queriesWhitelist.indexOf(key) === -1) {
            console.log('reject 1 <><> Invalid key name');
            return rejPromise(400, '/api/reviews?category=query', {
                valid_queries: ['sort_by', 'order', 'category'],
            });
        }
        if (key === 'order') {
            if (!(queries[key] === 'asc' || queries[key] === 'desc')) {
                console.log('reject 2 <><> Invaliid Order type');
                return rejPromise(400, '/api/reviews?category=query', {
                    valid_queries: ['sort_by', 'order', 'category'],
                });
            }
        }
    }

    console.log('Not rejected <><>');
};

exports.formatCheckVote = (object) => {
    if (
        typeof object.inc_votes !== 'number' ||
        Object.keys(object).length !== 1
    ) {
        return rejPromise(
            400,
            '/api/reviews/:id',
            'format to { inc_votes : number }'
        );
    }
};
