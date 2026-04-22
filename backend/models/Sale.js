const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        unit: {
            type: String,
            enum: ['Carton', 'Box', 'Piece'],
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        baseQuantity: {
            type: Number, // Quantity converted to pieces for stock deduction
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Completed'
    },
    date: {
        type: Date,
        default: Date.now
    },
    salesmanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salesman'
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);
