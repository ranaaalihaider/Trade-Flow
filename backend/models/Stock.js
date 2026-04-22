const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    // We store quantity in base unit (pieces) for easier calculation
    quantity: {
        type: Number,
        default: 0,
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one stock record per item per business
stockSchema.index({ itemId: 1, businessId: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
