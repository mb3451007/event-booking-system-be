const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isAvailable: { type: Boolean, },
  packages:mongoose.Schema.Types.ObjectId
});

 module.exports= mongoose.model('Item', itemSchema);


