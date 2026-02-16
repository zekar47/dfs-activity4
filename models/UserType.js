// models/UserType.js
const mongoose = require('mongoose');

const UserTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('UserType', UserTypeSchema);
