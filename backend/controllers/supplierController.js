const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');
const AppError = require('../utils/appError');

const getSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({ businessId: req.user.businessId });
    res.status(200).json(suppliers);
});

const getSupplier = asyncHandler(async (req, res, next) => {
    const supplier = await Supplier.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!supplier) return next(new AppError('Supplier not found', 404));
    res.status(200).json(supplier);
});

const createSupplier = asyncHandler(async (req, res) => {
    const { name, contactPhone, address, openingBalance } = req.body;
    const supplier = await Supplier.create({
        name,
        contactPhone,
        address,
        openingBalance,
        businessId: req.user.businessId
    });
    // Normally, opening balance would also create a ledger entry.
    // For simplicity in Phase 3, we just create the supplier.
    res.status(201).json(supplier);
});

const updateSupplier = asyncHandler(async (req, res, next) => {
    let supplier = await Supplier.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!supplier) return next(new AppError('Supplier not found', 404));

    supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json(supplier);
});

const deleteSupplier = asyncHandler(async (req, res, next) => {
    const supplier = await Supplier.findOne({ _id: req.params.id, businessId: req.user.businessId });
    if (!supplier) return next(new AppError('Supplier not found', 404));

    await supplier.deleteOne();
    res.status(200).json({ message: 'Supplier removed' });
});

module.exports = { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };
