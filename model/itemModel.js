const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isAvailable: { type: Boolean, },
  max_quantity: { type: Number,required: true },
  packages:mongoose.Schema.Types.ObjectId
});

 module.exports= mongoose.model('Item', itemSchema);


