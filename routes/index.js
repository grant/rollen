var constants = require('./../config/constants.js');
var User = require('./../models/user');

/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('index', { title: constants.APP_NAME });
};

exports.play = function (req, res) {
  if (!req.user) {
    res.redirect('/');
  } else {
    res.render('app', {
      title: constants.APP_NAME,
      name: req.user.name,
      photo: req.user.photo,
      accessToken: req.user.accessToken
    });
  }
};

exports.authError = function(req, res) {
  res.render('index', { success: 'false' });
};

exports.authSuccess = function(req, res) {
  res.redirect('/play');
};
