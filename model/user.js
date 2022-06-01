const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {type:String},
    lastname: {type:String},
    username: {type:String, unique: true},
    email: {type:String, unique:true},
    password: {type:String},
    gender: {type:String},
    status: {type:Boolean},
    // date: {type: Date},
    pic: {type:String}
    // token: {type:String}
})

module.exports = mongoose.model('users', userSchema);