const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price :{type :Number , required : true , min:0},
  description: { type: String, required: true },
});

 module.exports= mongoose.model('package', packageSchema);