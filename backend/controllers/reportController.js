const asyncHandler = require('express-async-handler');
const Stock = require('../models/Stock');
const Ledger = require('../models/Ledger');
const Sale = require('../models/Sale');
const Purchase = require('../models/Purchase');

// @desc    Get Stock Report
// @route   GET /api/reports/stock
// @access  Private
const getStockReport = asyncHandler(async (req, res) => {
    const stocks = await Stock.find({ businessId: req.user.businessId })
        .populate({
            path: 'itemId',
            select: 'name units prices companyId categoryId',
            populate: [
                { path: 'companyId', select: 'name' },
                { path: 'categoryId', select: 'name' }
            ]
        });
    res.status(200).json(stocks);
});

// @desc    Get Ledger Report (for Customer, Supplier, or Account)
// @route   GET /api/reports/ledger/:accountId
// @access  Private
const getLedgerReport = asyncHandler(async (req, res) => {
    const ledgers = await Ledger.find({ 
        accountId: req.params.accountId,
        businessId: req.user.businessId 
    }).sort('date');
    res.status(200).json(ledgers);
});

// @desc    Get General Dashboard Stats
// @route   GET /api/reports/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const businessId = req.user.businessId;

    const totalSales = await Sale.aggregate([
        { $match: { businessId } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalPurchases = await Purchase.aggregate([
        { $match: { businessId } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
        totalSales: totalSales[0]?.total || 0,
        totalPurchases: totalPurchases[0]?.total || 0
    });
});

module.exports = { getStockReport, getLedgerReport, getDashboardStats };
