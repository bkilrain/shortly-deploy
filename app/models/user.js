var usersSchema = require('../collections/users.js');
var mongoose = require('mongoose');

var User = mongoose.model('User', usersSchema);


module.exports = User;
