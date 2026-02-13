const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // This means each product belongs to a user
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
