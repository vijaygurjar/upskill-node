const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {type:String, default:'Guest'},
    lastname: {type:String, default: ''},
    email: {type:String, unique:true},
    password: {type:String},
    gender: {type:String, default: 'M'},
    status: {type:Boolean, default: true},
    pic: {type:String, default: ''},
    googleid: {type:String, default: ''}
})

module.exports = mongoose.model('users', userSchema);