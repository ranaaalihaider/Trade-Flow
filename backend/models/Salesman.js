const mongoose = require('mongoose');

const salesmanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    routes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    }],
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

module.exports = mongoose.model('Salesman', salesmanSchema);
