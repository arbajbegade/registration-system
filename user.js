const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  dateOfBirth: Date,
  name:String,
  email: String,
  password: String,
});

 module.exports = mongoose.model('User', userSchema);
// const User = mongoose.model('User', userSchema);