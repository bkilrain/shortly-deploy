var mongoose = require('mongoose');

var urlsSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now }
});


module.exports = urlsSchema;