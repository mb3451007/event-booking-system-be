const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true },
  webhook: {
    amount: Number,
    currency: String,
    status: String,
    paymentMethod: String,
    created: Number,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
