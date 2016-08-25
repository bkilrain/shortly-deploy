var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    if (err) {
      console.log('no links');
    } else {
      res.status(200).send(links);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.findOne({ url: uri }, function(err, link) {
    if (link) {
      res.status(200).send(link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }

        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });

        newLink.save(function(err) {
          if (err) {
            console.log('error saving link');
          } else {
            console.log(newLink.url, 'what will be sent to our user///test!!');
            res.status(200).send(newLink);
          }
        });
      });
    }
  });

  // new Link({ url: uri }).fetch().then(function(found) {
  //   if (found) {
  //     res.status(200).send(found.attributes);
  //   } else {
      // util.getUrlTitle(uri, function(err, title) {
      //   if (err) {
      //     console.log('Error reading URL heading: ', err);
      //     return res.sendStatus(404);
      //   }
      //   var newLink = new Link({
      //     url: uri,
      //     title: title,
      //     baseUrl: req.headers.origin
      //   });
      //   newLink.save().then(function(newLink) {
      //     Links.add(newLink);
      //     res.status(200).send(newLink);
      //   });
      // });
  //   }
  // });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {
    if (err || user === null) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });






  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       });
  //     }
  //   });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function (err, user) {
    if (user) {
      console.log('Account already exists');
      res.redirect('/signup');
    } else {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save()
        .then(function(newUser) {
          util.createSession(req, res, newUser);
        });
    }
  });
};

// exports.signupUser = function(req, res) {//convert
//   var username = req.body.username;
//   var password = req.body.password;

//   new User({ username: username })
//     .fetch()
//     .then(function(user) {
//       if (!user) {
//         var newUser = new User({
//           username: username,
//           password: password
//         });
//         newUser.save()
//           .then(function(newUser) {
//             Users.add(newUser);
//             util.createSession(req, res, newUser);
//           });
//       } else {
        // console.log('Account already exists');
        // res.redirect('/signup');
//       }
//     });
// };

exports.navToLink = function(req, res) {

  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (link !== null) {
      link.visits = link.visits + 1;
      link.save(function(err) {
        if (err) {
          throw err;
        } else {
          res.redirect(link.url);
        }
      });
    } else {
      res.redirect('/');
    }
  });
  // new Link({ code: req.params[0] })
  // .fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};