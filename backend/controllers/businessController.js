const asyncHandler = require('express-async-handler');
const Business = require('../models/Business');
const AppError = require('../utils/appError');

// @desc    Get all businesses
// @route   GET /api/businesses
// @access  Private/SuperAdmin
const getBusinesses = asyncHandler(async (req, res) => {
    const businesses = await Business.find({});
    res.status(200).json(businesses);
});

// @desc    Get single business
// @route   GET /api/businesses/:id
// @access  Private/SuperAdmin or Admin of this business
const getBusiness = asyncHandler(async (req, res, next) => {
    const business = await Business.findById(req.params.id);

    if (!business) {
        return next(new AppError('Business not found', 404));
    }

    // If not SuperAdmin, can only view own business
    if (req.user.role !== 'SuperAdmin' && req.user.businessId.toString() !== business._id.toString()) {
        return next(new AppError('Not authorized to access this business', 403));
    }

    res.status(200).json(business);
});

// @desc    Create new business
// @route   POST /api/businesses
// @access  Private/SuperAdmin
const createBusiness = asyncHandler(async (req, res) => {
    const { name, address, contactPhone, contactEmail } = req.body;

    const business = await Business.create({
        name,
        address,
        contactPhone,
        contactEmail
    });

    res.status(201).json(business);
});

// @desc    Update business
// @route   PUT /api/businesses/:id
// @access  Private/SuperAdmin or Admin
const updateBusiness = asyncHandler(async (req, res, next) => {
    let business = await Business.findById(req.params.id);

    if (!business) {
        return next(new AppError('Business not found', 404));
    }

    // If not SuperAdmin, can only update own business
    if (req.user.role !== 'SuperAdmin' && req.user.businessId.toString() !== business._id.toString()) {
        return next(new AppError('Not authorized to access this business', 403));
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json(business);
});

// @desc    Delete business
// @route   DELETE /api/businesses/:id
// @access  Private/SuperAdmin
const deleteBusiness = asyncHandler(async (req, res, next) => {
    const business = await Business.findById(req.params.id);

    if (!business) {
        return next(new AppError('Business not found', 404));
    }

    await business.deleteOne();

    res.status(200).json({ message: 'Business removed' });
});

module.exports = {
    getBusinesses,
    getBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness
};
