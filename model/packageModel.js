const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

 module.exports= mongoose.model('package', packageSchema);