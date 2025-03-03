const mongoose = require("mongoose");

const bookingItemsSchema = new mongoose.Schema({
  bookingId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("bookingitems", bookingItemsSchema);
