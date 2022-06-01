const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {type:String},
  type: {type:String},
  description:{type:String},
  filename: {type:String},
  assets: {type: Array},
  height: {type:Number},
  width: {type:Number},
  price: {type:Number},
  rating: {type:Number}
})

module.exports = mongoose.model('products', productSchema);