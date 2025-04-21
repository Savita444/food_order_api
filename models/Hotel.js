const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
  email: { type: String, required: true},
  password: { type: String, required: true },
  mobile_no: { type: String, required: true },
  hotel_name: { type: String, required: true },

  gst_certificate: { type: String },
  pan_card: { type: String },
  fssai_license: { type: String },
  bank_account_no: { type: String },
  type: { type: String },
  isActive: { type: Number, default: 1 }, 
  isDelete: { type: Number, default: 0 }, 
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
