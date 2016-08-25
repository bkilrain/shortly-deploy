var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  date: { type: Date, default: Date.now },

});

usersSchema.pre('save', function (done) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      done();
    });
});

usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    console.log(err); //thisworks?
    callback(isMatch);
  });
};

// usersSchema.methods.hashPassword = function() {
// };

module.exports = usersSchema;

// var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.get('password'), null, null).bind(this)
//     .then(function(hash) {
//       this.set('password', hash);
//     });