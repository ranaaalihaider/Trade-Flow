const asyncHandler = require('express-async-handler');
const Account = require('../models/Account');
const AppError = require('../utils/appError');

const getAccounts = asyncHandler(async (req, res) => {
    const accounts = await Account.find({ businessId: req.user.businessId });
    res.status(200).json(accounts);
});

const getAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!account) return next(new AppError('Account not found', 404));
    res.status(200).json(account);
});

const createAccount = asyncHandler(async (req, res) => {
    const { name, type, accountNumber, balance } = req.body;
    const account = await Account.create({
        name,
        type,
        accountNumber,
        balance: balance || 0,
        businessId: req.user.businessId
    });
    res.status(201).json(account);
});

module.exports = { getAccounts, getAccount, createAccount };
