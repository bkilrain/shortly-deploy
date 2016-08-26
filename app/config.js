var mongoose = require('mongoose');

if (process.env.NODE_ENV) {
  console.log('PRODUCTION ENV!');
  mongoose.connect('mongodb://45.55.23.9/shortly');
} else {
  console.log('DEV ENV!');
  mongoose.connect('mongodb://localhost/shortly');
}
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database started...');
});
db.once('close', function () {
  console.log('Goodbye!');
});
  


module.exports = db;