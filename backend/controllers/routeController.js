const asyncHandler = require('express-async-handler');
const Route = require('../models/Route');
const AppError = require('../utils/appError');

const getRoutes = asyncHandler(async (req, res) => {
    const routes = await Route.find({ businessId: req.user.businessId }).populate('sectorId', 'name');
    res.status(200).json(routes);
});

const getRoute = asyncHandler(async (req, res, next) => {
    const route = await Route.findOne({ _id: req.params.id, businessId: req.user.businessId }).populate('sectorId', 'name');
    if (!route) return next(new AppError('Route not found', 404));
    res.status(200).json(route);
});

const createRoute = asyncHandler(async (req, res) => {
    const { name, sectorId } = req.body;
    const route = await Route.create({
        name,
        sectorId,
        businessId: req.user.businessId
    });
    res.status(201).json(route);
});

const updateRoute = asyncHandler(async (req, res, next) => {
    let route = await Route.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!route) return next(new AppError('Route not found', 404));

    route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(route);
});

const deleteRoute = asyncHandler(async (req, res, next) => {
    const route = await Route.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!route) return next(new AppError('Route not found', 404));

    await route.deleteOne();
    res.status(200).json({ message: 'Route removed' });
});

module.exports = { getRoutes, getRoute, createRoute, updateRoute, deleteRoute };
