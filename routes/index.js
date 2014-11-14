var constants = require('./../config/constants.js');
var User = require('./../models/user');
var UserLikes = require('./../models/user_likes');
var request = require('request');

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
  User.findOne({_id: req.user._id}, function(err, user) {
    if (user.queue.length === 0) {
      require('./../helpers/rank')(user, function(newUser) {
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
    } else {
      var outPut = user.queue.splice(0, 3);
      var remainder = user.queue.splice(3);

      user.queue = remainder;
      user.seen.concat(outPut);

      user.save(function(err, newUser) {
        res.json({
          'queue': outPut
        });
      });
    }

  });
};

exports.movieLiked = function(req, res) {
  // get the movie object that was liked
  // update list in user_likes
  // add the liked movie in movie_likes
  // re-rank the queue
  var liked_movie = req.body.movie;
  UserLikes.findOne({fb_id: req.user.fb_id}, function(err, userlikes) {
    if (userlikes.movies.likes.indexOf(liked_movie.tmdb_id) === -1) {
      userlikes.movie_likes.push(liked_movie.tmdb_id);
      userlikes.save(function(err, n) {
        User.findOne({fb_id: req.user.fb_id}, function(err, user) {
          user.movie_likes.push(liked_movie);
          user.save(function(err, n) {
            require('./../helpers/rank')(n, function(newUser) {
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
    } else {
      res.json({
        response: 'ok'
      });
    }
  });
};

exports.getFriendsWhoLike = function(req, res) {
  var movie_tmdb = req.query.movie_tmdb;
  var friends_result = [];

  var req_user_friend_ids = [];
  for (var i = 0; i < req.user.friends.length; i++) {
    var f = req.user.friends[i];
    req_user_friend_ids.push(f.id);
  }

  UserLikes.find({}, function(err, userlikes) {
    for (var i = 0; i < userlikes.length; i++) {
      var ul = userlikes[i];
      if (ul.movie_likes.indexOf(movie_tmdb) !== -1 && ul.fb_id !== req.user.fb_id) {
        // found a user who has liked this movie
        // need to make sure this user is a friend
        if (req_user_friend_ids.indexOf(ul.fb_id) !== -1) {
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

exports.makeEvent = function(req, res) {
  var title = req.body.title;
  require('./../helpers/date.js').nextSaturday(function(date) {
    request({
      url: 'https://graph.facebook.com/v1.0/me/events',
      method: 'POST',
      form: {
        'access_token': req.user.accessToken,
        'name': title,
        'start_time': date
      }
    }, function(err, resp, body) {
        if (!err && resp.statusCode === 200) {
          body = JSON.parse(body);
          var event_id = body.id;
          res.json({
            'event': 'https://www.facebook.com/events/' + event_id
          });
        }
    });
  });
}

exports.recommend = function(req, res) {
  var from = req.user.fb_id;
  var to = req.body.to_fb_id;
  var movie = req.body.movie;

  movie.recommended_by = req.user.name;

  User.findOne({fb_id: to}, function(err, to_user) {
    if (err || !to_user) {
      return res.send('fail');
    }
    to_user.queue = [movie].concat(to_user.queue || []);
    to_user.save(function(err, n) {
      if (!n) {
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
}

exports.search = function(req, res) {
  var search_term = req.query.text.toLowerCase();
  var search_results = [];

  for (var i = 0; i < req.user.friends.length; i++) {
    var friend = req.user.friends[i];
    if (friend.name.toLowerCase().indexOf(search_term) > -1) {
      search_results.push(friend);
    }
  }

  res.json({
    'results': search_results
  });

}

exports.allLikes = function(req, res) {
  res.json({
    'result': req.user.movie_likes
  });
}
