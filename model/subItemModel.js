const mongoose = require('mongoose');

const SubItemSchema = new mongoose.Schema({
    name :{type :String , required : true },
    price :{type :Number , required : true , min:0},
    isAvailable:{type :Boolean },
    isOptional:{type :Boolean },
    items: mongoose.Schema.Types.ObjectId
})
module.exports =mongoose.model('subItem',SubItemSchema)