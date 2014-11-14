var constants = require('./../config/constants.js');
var User = require('./../models/user');

/*
 * GET home page.
 */

exports.index = function (req, res){
  res.render('splash', { title: constants.APP_NAME });
};

exports.app = function (req, res) {
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
  res.redirect('/app');
};

exports.getMovies = function(req, res) {
  // return top 3 from queue
  // move these top 3 from queue to seen
  User.findOne({id: req.user.id}, function(err, user) {
    var outPut = user.queue.splice(0, 3);
    var remainder = user.queue.splice(3);

    user.queue = remainder;
    user.seen.concat(outPut);

    user.save(function(err, newUser) {
      res.json({
        'queue': outPut
      });
    });

  });
}
