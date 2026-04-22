const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');
const AppError = require('../utils/appError');

const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find({ businessId: req.user.businessId }).populate('routeId', 'name');
    res.status(200).json(customers);
});

const getCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findOne({ _id: req.params.id, businessId: req.user.businessId }).populate('routeId', 'name');
    if (!customer) return next(new AppError('Customer not found', 404));
    res.status(200).json(customer);
});

const createCustomer = asyncHandler(async (req, res) => {
    const { name, contactPhone, address, routeId, openingBalance } = req.body;
    const customer = await Customer.create({
        name,
        contactPhone,
        address,
        routeId,
        openingBalance,
        businessId: req.user.businessId
    });
    res.status(201).json(customer);
});

const updateCustomer = asyncHandler(async (req, res, next) => {
    let customer = await Customer.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!customer) return next(new AppError('Customer not found', 404));

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(customer);
});

const deleteCustomer = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!customer) return next(new AppError('Customer not found', 404));

    await customer.deleteOne();
    res.status(200).json({ message: 'Customer removed' });
});

module.exports = { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
