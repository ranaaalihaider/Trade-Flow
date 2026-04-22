const asyncHandler = require('express-async-handler');
const Sector = require('../models/Sector');
const AppError = require('../utils/appError');

const getSectors = asyncHandler(async (req, res) => {
    const sectors = await Sector.find({ businessId: req.user.businessId });
    res.status(200).json(sectors);
});

const getSector = asyncHandler(async (req, res, next) => {
    const sector = await Sector.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!sector) return next(new AppError('Sector not found', 404));
    res.status(200).json(sector);
});

const createSector = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const sector = await Sector.create({
        name,
        businessId: req.user.businessId
    });
    res.status(201).json(sector);
});

const updateSector = asyncHandler(async (req, res, next) => {
    let sector = await Sector.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!sector) return next(new AppError('Sector not found', 404));

    sector = await Sector.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(sector);
});

const deleteSector = asyncHandler(async (req, res, next) => {
    const sector = await Sector.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!sector) return next(new AppError('Sector not found', 404));

    await sector.deleteOne();
    res.status(200).json({ message: 'Sector removed' });
});

module.exports = { getSectors, getSector, createSector, updateSector, deleteSector };
