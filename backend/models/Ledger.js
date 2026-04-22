const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Could refer to Supplier, Customer, Account (Cash/Bank)
        refPath: 'accountModel'
    },
    accountModel: {
        type: String,
        required: true,
        enum: ['Supplier', 'Customer', 'Account']
    },
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        // Could refer to Purchase, Sale, Payment, Receipt
    },
    transactionType: {
        type: String,
        enum: ['Purchase', 'Sale', 'PaymentOut', 'PaymentIn', 'OpeningBalance'],
        required: true
    },
    type: {
        type: String,
        enum: ['DEBIT', 'CREDIT'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ledger', ledgerSchema);
