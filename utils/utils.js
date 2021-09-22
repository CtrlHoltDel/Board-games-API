exports.sqlToJsDate = (date) => {
    const [year, month, day] = [...date.slice(0, 10).split('-')];
    const dayTest = new Date(`${year}-${month}-${day}`);
    return dayTest;
};

exports.limitOffset = (limit, p) => {
    let LIMIT = limit || 10;
    let OFFSET = p ? (p - 1) * LIMIT : 0;
    return [LIMIT, OFFSET];
};
