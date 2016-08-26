var urlsSchema = require('../collections/links.js');
var mongoose = require('mongoose');

var Link = mongoose.model('Link', urlsSchema);

module.exports = Link;
