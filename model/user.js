const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {type:String},
    lastname: {type:String},
    email: {type:String, unique:true},
    password: {type:String},
    gender: {type:String},
    status: {type:Boolean},
    pic: {type:String},
    googleid: {type:String}
})

module.exports = mongoose.model('users', userSchema);