const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },

    batch: {
        type: [String],
        default: [],
        index: true   // 🔥 important
    },

    phone: {
        type: String,
        required: true,
        index: true   // 🔥 fast search
    },

    address: { type: String, required: true },

    admissionDate: {
        type: String,
        required: true,
        index: true   // 🔥 filtering by date
    },

    paidAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    status: {
        type: String,
        default: 'Unpaid',
        index: true   // 🔥 paid/unpaid queries
    },

    photo: { type: String, default: '' },

    validityFrom: { type: String, default: '' },
    validityTo: { type: String, default: '' },

    seatNumber: {
        type: Number,
        default: 0,
        index: true   // 🔥 seat lookup
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
