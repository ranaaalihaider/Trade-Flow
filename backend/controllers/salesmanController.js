const asyncHandler = require('express-async-handler');
const Salesman = require('../models/Salesman');
const User = require('../models/User');
const AppError = require('../utils/appError');

const getSalesmen = asyncHandler(async (req, res) => {
    const salesmen = await Salesman.find({ businessId: req.user.businessId })
        .populate('userId', 'name email')
        .populate('routes', 'name');
    res.status(200).json(salesmen);
});

const getSalesman = asyncHandler(async (req, res, next) => {
    const salesman = await Salesman.findOne({ _id: req.params.id, businessId: req.user.businessId })
        .populate('userId', 'name email')
        .populate('routes', 'name');
    if (!salesman) return next(new AppError('Salesman not found', 404));
    res.status(200).json(salesman);
});

const createSalesman = asyncHandler(async (req, res, next) => {
    const { userId, routes } = req.body;
    
    // Check if user exists and is a salesman
    const user = await User.findById(userId);
    if (!user || user.role !== 'Salesman') {
        return next(new AppError('User not found or not a Salesman', 400));
    }

    const salesman = await Salesman.create({
        userId,
        routes,
        businessId: req.user.businessId
    });
    res.status(201).json(salesman);
});

const updateSalesman = asyncHandler(async (req, res, next) => {
    let salesman = await Salesman.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!salesman) return next(new AppError('Salesman not found', 404));

    salesman = await Salesman.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(salesman);
});

const deleteSalesman = asyncHandler(async (req, res, next) => {
    const salesman = await Salesman.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!salesman) return next(new AppError('Salesman not found', 404));

    await salesman.deleteOne();
    res.status(200).json({ message: 'Salesman removed' });
});

module.exports = { getSalesmen, getSalesman, createSalesman, updateSalesman, deleteSalesman };
