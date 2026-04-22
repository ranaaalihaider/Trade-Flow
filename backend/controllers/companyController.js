const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');
const AppError = require('../utils/appError');

const getCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find({ businessId: req.user.businessId });
    res.status(200).json(companies);
});

const getCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!company) return next(new AppError('Company not found', 404));
    res.status(200).json(company);
});

const createCompany = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const company = await Company.create({
        name,
        description,
        businessId: req.user.businessId
    });
    res.status(201).json(company);
});

const updateCompany = asyncHandler(async (req, res, next) => {
    let company = await Company.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!company) return next(new AppError('Company not found', 404));

    company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(company);
});

const deleteCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!company) return next(new AppError('Company not found', 404));

    await company.deleteOne();
    res.status(200).json({ message: 'Company removed' });
});

module.exports = { getCompanies, getCompany, createCompany, updateCompany, deleteCompany };
