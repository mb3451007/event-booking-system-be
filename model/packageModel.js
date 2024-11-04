const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  minPersons: { type: Number, required: true },
  maxPersons: { type: Number, required: true },
  description: { type: String },
  finalNotes: { type: String },
  discount: { type: Boolean, default: false },
  discountPercentage: { type: Number, default: null },
  discountName: { type: String, default: null }
});

module.exports = mongoose.model('Package', packageSchema);
