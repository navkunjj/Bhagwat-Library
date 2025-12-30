const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    batch: { type: [String], default: [] }, // Array of strings for multiple batches
    phone: { type: String, required: true },
    address: { type: String, required: true },
    admissionDate: { type: String, required: true }, // Keeping as String YYYY-MM-DD for simple consistency with frontend date inputs
    paidAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, default: 'Unpaid' },
    photo: { type: String, default: '' }, // Base64 string
    validityFrom: { type: String, default: '' },
    validityTo: { type: String, default: '' },
    seatNumber: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
