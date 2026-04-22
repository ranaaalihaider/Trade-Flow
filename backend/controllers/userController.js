const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public (or Private depending on rules, let's make it public for initial SuperAdmin, else restricted)
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, businessId } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(new AppError('User already exists', 400));
    }

    // Role check logic can be added here if needed

    const user = await User.create({
        name,
        email,
        password,
        role,
        businessId: role === 'SuperAdmin' ? undefined : businessId
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            businessId: user.businessId,
            token: generateToken(user._id)
        });
    } else {
        return next(new AppError('Invalid user data', 400));
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password').populate('businessId', 'name');

    if (user && (await user.matchPassword(password))) {
        if (!user.isActive) {
            return next(new AppError('Your account has been disabled', 401));
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            businessId: user.businessId,
            token: generateToken(user._id)
        });
    } else {
        return next(new AppError('Invalid email or password', 401));
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('businessId', 'name');

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            businessId: user.businessId
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users (for a specific business)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role !== 'SuperAdmin') {
        query.businessId = req.user.businessId;
    }

    const users = await User.find(query).populate('businessId', 'name');
    res.json(users);
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getUsers
};
