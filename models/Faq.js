const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },

    isActive: { type: Number, default: 1 },
    isDelete: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('FAQ', FaqSchema);
