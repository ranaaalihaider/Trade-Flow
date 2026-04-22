const asyncHandler = require('express-async-handler');
const Item = require('../models/Item');
const AppError = require('../utils/appError');

const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find({ businessId: req.user.businessId })
        .populate('companyId', 'name')
        .populate('categoryId', 'name');
    res.status(200).json(items);
});

const getItem = asyncHandler(async (req, res, next) => {
    const item = await Item.findOne({ _id: req.params.id, businessId: req.user.businessId })
        .populate('companyId', 'name')
        .populate('categoryId', 'name');
    if (!item) return next(new AppError('Item not found', 404));
    res.status(200).json(item);
});

const createItem = asyncHandler(async (req, res) => {
    const { name, companyId, categoryId, units, prices } = req.body;
    const item = await Item.create({
        name,
        companyId,
        categoryId,
        units,
        prices,
        businessId: req.user.businessId
    });
    res.status(201).json(item);
});

const updateItem = asyncHandler(async (req, res, next) => {
    let item = await Item.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!item) return next(new AppError('Item not found', 404));

    item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(item);
});

const deleteItem = asyncHandler(async (req, res, next) => {
    const item = await Item.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!item) return next(new AppError('Item not found', 404));

    await item.deleteOne();
    res.status(200).json({ message: 'Item removed' });
});

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
