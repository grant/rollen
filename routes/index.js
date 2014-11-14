var constants = require('./../config/constants.js');
var User = require('./../models/user.js');

/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { title: constants.APP_NAME });
};

exports.play = function (req, res) {
  console.log(req.user);
  User.findOneById(req.user.id, function(user, err) {
    console.log('..........');
    console.log(req.user);
  });
};

exports.authError = function(req, res) {
  res.render('index', { success: 'false' });
};

exports.authSuccess = function(req, res) {
  res.redirect('/play');
};
