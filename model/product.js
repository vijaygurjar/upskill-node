const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {type: String, default: 'xyz'},
  type: {type: String, default: 'dairy'},
  description: {type: String, default: 'not added'},
  pic: {type: String, default: ''},
  price: {type: Number, default: 10},
  rating: {type: Number, default: 0},
  stock: {type: Number, default: 0},
  status: {type: Boolean, default: true},
  images: {type: Array, default: []}
})

module.exports = mongoose.model('products', productSchema);