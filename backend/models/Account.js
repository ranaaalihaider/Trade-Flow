const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an account name'],
        trim: true
    },
    type: {
        type: String,
        enum: ['Cash', 'Bank'],
        required: true
    },
    accountNumber: {
        type: String // Relevant for Bank type
    },
    balance: {
        type: Number,
        default: 0
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
