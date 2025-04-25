const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  role: { 
    type: String,
    default: null,
    enum: ['sub-admin', 'editor', 'co-editor'],
  },
  lastLoginTime: {
    type: Date, 
    default: null,
  },
  isActive: {
    type: Boolean, 
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
