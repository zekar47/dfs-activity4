const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true } // This will store the HASH, not the real password
});

module.exports = mongoose.model('User', UserSchema);
