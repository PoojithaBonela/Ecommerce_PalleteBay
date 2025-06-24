const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Set to true if addresses must be linked to a logged-in user
  },
  country: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  flat: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Address', addressSchema);