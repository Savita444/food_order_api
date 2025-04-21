const mongoose = require('mongoose');

const QRSchema = new mongoose.Schema({
  location_name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  qr_code_image: { type: String }, // Add field to save QR image filename
  isActive: { type: Number, default: 1 },
  isDelete: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('QRCode', QRSchema);
