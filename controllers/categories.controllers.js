const { fetchCategories } = require('../models/categories.models');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await fetchCategories();
        res.status(200).send({ categories });
    } catch (err) {
        next(err);
    }
};
