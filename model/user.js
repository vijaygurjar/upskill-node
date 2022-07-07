const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, default: 'Guest' },
  lastname: { type: String, default: '' },
  email: { type: String, unique: true, required: [true, 'email required'] },
  password: { type: String, required: [true, 'email required'] },
  gender: { type: String, default: 'M' },
  status: { type: Boolean, default: true },
  pic: { type: String, default: '' },
  googleid: { type: String}
})

module.exports = mongoose.model('users', userSchema);