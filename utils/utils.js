exports.sqlToJsDate = (date) => {
    const [year, month, day] = [...date.slice(0, 10).split('-')];
    const dayTest = new Date(`${year}-${month}-${day}`);
    return dayTest;
};
