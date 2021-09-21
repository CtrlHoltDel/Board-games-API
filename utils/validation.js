exports.fetchAllReviewsValidate = (queries) => {
    const queriesWhitelist = ['sort_by', 'order', 'category'];
    const currentKeys = Object.keys(queries);

    for (let i = 0; i < currentKeys.length; i++) {
        const key = currentKeys[i];
        if (queriesWhitelist.indexOf(key) === -1) return false;
        if (key === 'order') {
            if (!(queries[key] === 'asc' || queries[key] === 'desc')) {
                return false;
            }
        }
    }

    return true;
};

exports.formatCheckVote = (object) => {
    if (
        typeof object.inc_votes !== 'number' ||
        Object.keys(object).length !== 1
    ) {
        return false;
    }

    return true;
};
