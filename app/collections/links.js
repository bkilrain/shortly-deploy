var mongoose = require('mongoose');
var crypto = require('crypto');

var urlsSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  date: { type: Date, default: Date.now }
});

urlsSchema.pre('save', function(done) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  done();
});

module.exports = urlsSchema;