const mongoose = require("mongoose");

const SubItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  isAvailable: { type: Boolean },
  items: mongoose.Schema.Types.ObjectId,
  imageUrl: { type: String, default: null },
});
module.exports = mongoose.model("subItem", SubItemSchema);
