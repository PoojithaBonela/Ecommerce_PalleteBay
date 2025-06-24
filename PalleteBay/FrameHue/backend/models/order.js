// Path: FrameHue/backend/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  cart: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: false // Make required true if an address is always needed
  },
  paymentMethod: {
    type: String,
    required: false // Make required true if a payment method is always needed
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
