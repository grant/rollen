var constants = require('./../config/constants.js');
var User = require('./../models/user');
var UserLikes = require('./../models/user_likes');

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
};

exports.movieLiked = function(req, res) {
  // get the movie object that was liked
  // update list in user_likes
  // add the liked movie in movie_likes
  // re-rank the queue
  var liked_movie = req.body.movie;
  UserLikes.findOne({fb_id: req.user.fb_id}, function(err, userlikes) {
    userlikes.movie_likes.push(movie.tmdb_id);
    userlikes.save(function(err, n) {
      User.findOne({fb_id: req.user.fb_id}, function(err, user) {
        user.movie_likes.push(movie);
        user.save(function(err, n) {
          require('./../helpers/rank')(function(newUser) {
            if (!newUser) {
              res.json({
                response: 'fail'
              });
            } else {
              res.json({
                response: 'ok'
              });
            }
          });
        });
      });
    });
  });
};

exports.getFriendsWhoLike = function(req, res) {
  var movie_tmdb = req.query.movie_tmdb;
  var friends_result = [];

  UserLikes.find({}, function(err, userlikes) {
    for (var ul in userlikes) {
      if (ul.movie_likes.indexof(movie_tmdb) !== -1 && ul.fb_id !== req.user.fb_id) {
        // found a user who has liked this movie
        // need to make sure this user is a friend
        if (req.user.friends.indexof(ul.fb_id) !== -1) {
          // yes, it's a friend
          friends_result.push({
            fb_id: ul.fb_id,
            name: ul.fb_id,
            photo: ul.photo
          });
        }
      }
    }
    res.json({
      'friends': friends_result
    });
  });
}
