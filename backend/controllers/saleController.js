const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Stock = require('../models/Stock');
const Customer = require('../models/Customer');
const Ledger = require('../models/Ledger');
const AppError = require('../utils/appError');

const getSales = asyncHandler(async (req, res) => {
    const sales = await Sale.find({ businessId: req.user.businessId })
        .populate('customerId', 'name')
        .sort('-date');
    res.status(200).json(sales);
});

const createSale = asyncHandler(async (req, res, next) => {
    const { customerId, invoiceNumber, items, totalAmount, date, salesmanId } = req.body;
    const businessId = req.user.businessId;

    // 1. Create Sale
    const sale = await Sale.create({
        customerId,
        invoiceNumber,
        items,
        totalAmount,
        date,
        salesmanId,
        businessId
    });

    // 2. Update Stock (Decrease)
    for (const item of items) {
        // You might want to check if sufficient stock exists first
        const stock = await Stock.findOne({ itemId: item.itemId, businessId });
        if (!stock || stock.quantity < item.baseQuantity) {
            return next(new AppError(`Insufficient stock for item ID: ${item.itemId}`, 400));
        }

        await Stock.findOneAndUpdate(
            { itemId: item.itemId, businessId },
            { $inc: { quantity: -item.baseQuantity } },
            { new: true }
        );
    }

    // 3. Update Customer Ledger
    const customer = await Customer.findById(customerId);
    if (!customer) return next(new AppError('Customer not found', 404));
    
    // Sale means customer owes us (Debit)
    const lastLedger = await Ledger.findOne({ accountId: customerId }).sort('-createdAt');
    let balanceAfter = lastLedger ? lastLedger.balanceAfter + totalAmount : customer.openingBalance + totalAmount;

    await Ledger.create({
        accountId: customerId,
        accountModel: 'Customer',
        transactionId: sale._id,
        transactionType: 'Sale',
        type: 'DEBIT',
        amount: totalAmount,
        balanceAfter,
        description: `Sale Invoice: ${invoiceNumber}`,
        date: date || Date.now(),
        businessId
    });

    res.status(201).json(sale);
});

module.exports = { getSales, createSale };
