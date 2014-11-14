var constants = require('./../config/constants.js');
var User = require('./../models/user');

/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { title: constants.APP_NAME });
};

exports.play = function (req, res) {
  console.log(req.user);
  User.findOne({'id': req.user.id}, function(user, err) {
    console.log('..........');
    console.log(req.user.photo);
  });
};

exports.authError = function(req, res) {
  res.render('index', { success: 'false' });
};

exports.authSuccess = function(req, res) {
  res.redirect('/play');
};
