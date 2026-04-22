const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AppError = require('../utils/appError');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return next(new AppError('Not authorized, user not found', 401));
            }
            
            if (!req.user.isActive) {
                return next(new AppError('Not authorized, account disabled', 401));
            }

            // SuperAdmin Business Context Switching:
            // If a SuperAdmin sends an x-business-id header, they are scoping their
            // request to that specific business. Override businessId on the user object.
            if (req.user.role === 'SuperAdmin' && req.headers['x-business-id']) {
                req.user.businessId = req.headers['x-business-id'];
            }

            next();
        } catch (error) {
            console.error(error);
            return next(new AppError('Not authorized, token failed', 401));
        }
    }

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }
});

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(`User role ${req.user.role} is not authorized to access this route`, 403)
            );
        }
        next();
    };
};

module.exports = { protect, authorize };
