const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true },
  packageId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  noOfPersons: { type: Number, required: true },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, required: true },
  webhook: {
    amount: Number,
    currency: String,
    status: String,
    paymentMethod: String,
    created: Number,
  },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = mongoose.model("Booking", bookingSchema);
