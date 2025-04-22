const mongoose = require('mongoose');

const termCondition = new mongoose.Schema({
    type : { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },

    isActive: { type: Number, default: 1 },
    isDelete: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('term_conditions', termCondition);
