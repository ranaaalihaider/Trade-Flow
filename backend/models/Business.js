const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a business name'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Please add a business address']
    },
    contactPhone: {
        type: String,
        required: [true, 'Please add a contact phone']
    },
    contactEmail: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Business', businessSchema);
