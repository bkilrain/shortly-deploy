var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  date: { type: Date, default: Date.now }
});

module.exports = usersSchema;