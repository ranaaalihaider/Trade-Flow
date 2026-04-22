const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const AppError = require('../utils/appError');

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ businessId: req.user.businessId }).populate('companyId', 'name');
    res.status(200).json(categories);
});

const getCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findOne({ _id: req.params.id, businessId: req.user.businessId }).populate('companyId', 'name');
    if (!category) return next(new AppError('Category not found', 404));
    res.status(200).json(category);
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, companyId } = req.body;
    const category = await Category.create({
        name,
        companyId,
        businessId: req.user.businessId
    });
    res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res, next) => {
    let category = await Category.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!category) return next(new AppError('Category not found', 404));

    category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(category);
});

const deleteCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!category) return next(new AppError('Category not found', 404));

    await category.deleteOne();
    res.status(200).json({ message: 'Category removed' });
});

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
