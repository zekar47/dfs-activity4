// models/UserType.js
const mongoose = require('mongoose');

const UserTypeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  descripcion: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('UserType', UserTypeSchema);
