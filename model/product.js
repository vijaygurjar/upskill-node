const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {type: String},
  type: {type: String},
  description: {type: String},
  pic: {type: String},
  price: {type: Number},
  rating: {type: Number},
  stock: {type: Number},
  status: {type: Boolean},
  images: {type: Array}
})

module.exports = mongoose.model('products', productSchema);