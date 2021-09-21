exports.rejPromise = (status, endpoint, error) =>
    Promise.reject({ status, endpoint, error });
