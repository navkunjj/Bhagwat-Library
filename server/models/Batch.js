const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
    time: { type: String, required: true },
    price: { type: String, required: true }, // Keeping as string to match frontend '250', but could be Number
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);
