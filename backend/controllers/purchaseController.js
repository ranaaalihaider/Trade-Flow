const asyncHandler = require('express-async-handler');
const Purchase = require('../models/Purchase');
const Stock = require('../models/Stock');
const Supplier = require('../models/Supplier');
const Ledger = require('../models/Ledger');
const AppError = require('../utils/appError');

const getPurchases = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find({ businessId: req.user.businessId })
        .populate('supplierId', 'name')
        .sort('-date');
    res.status(200).json(purchases);
});

const createPurchase = asyncHandler(async (req, res, next) => {
    const { supplierId, invoiceNumber, items, totalAmount, date } = req.body;
    const businessId = req.user.businessId;

    // 1. Create Purchase
    const purchase = await Purchase.create({
        supplierId,
        invoiceNumber,
        items,
        totalAmount,
        date,
        businessId
    });

    // 2. Update Stock
    for (const item of items) {
        await Stock.findOneAndUpdate(
            { itemId: item.itemId, businessId },
            { $inc: { quantity: item.baseQuantity } },
            { upsert: true, new: true }
        );
    }

    // 3. Update Supplier Ledger
    // Get supplier to update balance (or calculate)
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return next(new AppError('Supplier not found', 404));
    
    // Purchase means we owe supplier (Credit)
    const previousBalance = supplier.openingBalance; // In a real system, you sum all ledger entries or maintain a running balance
    // For simplicity we will query the last ledger entry for this supplier or use a maintained balance. Let's just create the ledger entry.
    
    // Let's get the latest balance
    const lastLedger = await Ledger.findOne({ accountId: supplierId }).sort('-createdAt');
    let balanceAfter = lastLedger ? lastLedger.balanceAfter + totalAmount : supplier.openingBalance + totalAmount;

    await Ledger.create({
        accountId: supplierId,
        accountModel: 'Supplier',
        transactionId: purchase._id,
        transactionType: 'Purchase',
        type: 'CREDIT',
        amount: totalAmount,
        balanceAfter,
        description: `Purchase Invoice: ${invoiceNumber}`,
        date: date || Date.now(),
        businessId
    });

    res.status(201).json(purchase);
});

module.exports = { getPurchases, createPurchase };
