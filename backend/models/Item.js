const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an item name'],
        trim: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    // Unit Hierarchy: Carton -> Box -> Piece
    units: {
        carton: {
            name: { type: String, default: 'Carton' },
            quantity: { type: Number, default: 1 } // Base is usually piece, but let's define conversions
        },
        box: {
            name: { type: String, default: 'Box' },
            quantityPerCarton: { type: Number, required: true }
        },
        piece: {
            name: { type: String, default: 'Piece' },
            quantityPerBox: { type: Number, required: true }
        }
    },
    prices: {
        purchasePrice: { type: Number, required: true }, // Usually per base unit (piece) or specific unit. We'll store base purchase price.
        sellingPriceCarton: { type: Number, required: true },
        sellingPriceBox: { type: Number, required: true },
        sellingPricePiece: { type: Number, required: true }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);
