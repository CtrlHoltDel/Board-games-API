const { fetchCategories, addCategory } = require('../models/categories.models');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await fetchCategories();
        res.status(200).send({ categories });
    } catch (err) {
        next(err);
    }
};

exports.postCategory = async (req, res, next) => {
    const { body } = req;
    try {
        const category = await addCategory(body);
        res.status(201).send({ category });
    } catch (err) {
        next(err);
    }
};
