exports.objectToArray = (object) => {
    const array = [];
    object.forEach((item) => {
        const innerArray = [];
        for (key in item) {
            innerArray.push(item[key]);
        }
        array.push(innerArray);
    });
    return array;
};
