const mongoose = require('mongoose');
const Role = require('./roleModel');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },  
  token: { type: String }  
});

module.exports = mongoose.model('User', userSchema);
