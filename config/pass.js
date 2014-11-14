/*
  This is a wrapper for all code used for user authentication.
*/

var FacebookStrategy = require('passport-facebook').Strategy;

// bring in the schema for user
var User = require('mongoose').model('User'),
    UserLikes = require('mongoose').model('UserLikes')
    Constants = require('./constants');
var request = require('request');
var async = require('async');

module.exports = function (passport) {

  /*
    user ID is serialized to the session. When subsequent requests are 
    received, this ID is used to find the user, which will be restored 
    to req.user.
  */
  passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id)
    done(null, user._id);
  });

  /*
    intended to return the user profile based on the id that was serialized 
    to the session.
  */
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
      // console.log(user)
      if(!err) done(null, user);
      else done(err, null)
    })
  });

  function getFriends(accessToken, callback) {
    request('https://graph.facebook.com/me?fields=friends&limit=1000&access_token='+accessToken,
      function(err, resp, body) {
        body = JSON.parse(body);
        callback(body.friends.data);
      });
  }

  function getLikedMovies(accessToken, fb_id, callback) {
    request('https://graph.facebook.com/'+fb_id+'/movies?offset=0&limit=100&access_token='+accessToken,
      function(err, resp, body) {
        body = JSON.parse(body);
        var movies = [];
        for (var i = 0; i < body.data.length; i++) {
          movies.push(body.data[i].name);
        }
        callback(movies);
      });
  }

  function getDirectorNames(dir, callback) {
    callback(null, dir.name);
  }

  function getActorNames(act, callback) {
    callback(null, act.name);
  }

  function getMovieData(movie, callback) {
    var url = 'http://api.trakt.tv/search/movies.json/'+Constants.TRAK_KEY+'?query='+encodeURIComponent(movie)+'&limit=1';
    request(url, function(err, resp, body) {
      if (err) {
        callback(null, null);
      } else {
        body = JSON.parse(body);
        var tmdb_id = ''+body[0].tmdb_id;
        request('http://api.trakt.tv/movie/summary.json/'+Constants.TRAK_KEY+'/'+tmdb_id,
          function(err, resp, body) {
            body = JSON.parse(body);

            async.mapLimit(body.people.directors, 10, getDirectorNames, function(err, directors) {
              async.mapLimit(body.people.actors, 10, getActorNames, function(err, actors) {
                callback(null, {
                  tmdb_id: tmdb_id,
                  imdb_id: body.imdb_id,
                  genres: body.genres,
                  title: body.title,
                  directors: directors,
                  actors: actors,
                  trailer: body.trailer,
                  url: body.url,
                  release_date: body.released,
                  tagline: body.tagline
                });
              });
            });
          });
      }
    });
  };

  function trailerExists(movie, callback) {
    callback(!movie || movie.trailer !== "");  // return true if trailer exists
  }

  function getMovieId(movie, callback) {
    callback(null, movie.tmdb_id);
  }

  // Logic for facebook strategy
  passport.use(new FacebookStrategy({
    clientID: Constants.Facebook.APPID,
    clientSecret: Constants.Facebook.SECRET,
    callbackURL: Constants.Facebook.CALLBACK,
    profileFields: ['id', 'emails', 'displayName', 'photos']
  }, function(accessToken, refreshToken, profile, done) {
    User.findOne({$or: [{fbId : profile.id }, {email: profile.emails[0].value}]}, function(err, oldUser) {
      if (oldUser) {
        console.log("old user detected");
        return done(null, oldUser);
      } else {
        if (err) return done(err);
        console.log("new user found");

        getFriends(accessToken, function(friends) {
          console.log("got " + friends.length + " friends");
          getLikedMovies(accessToken, profile.id, function(movies) {
            async.map(movies, getMovieData, function(err, result) {
              async.filter(result, trailerExists, function(results) {

                var newUser = new User({
                  fb_id: profile.id,
                  accessToken: accessToken,
                  email: profile.emails[0].value,
                  name: profile.displayName,
                  photo: profile.photos[0].value,
                  username: profile.emails[0].value.split('@')[0],
                  friends: friends,
                  seen: [],
                  movie_likes: results
                }).save(function(err, newUser) {
                  if (err) return done(err);
                  require('./../helpers/rank.js')(newUser, function(u) {
                    // also save in user_likes
                    UserLikes.findOne({'fb_id': profile.id}, function(err, user) {
                      async.mapLimit(results, 10, getMovieId, function(err, moviesIds) {
                        if (!user) {
                          console.log('no existing user');
                          new UserLikes({
                            fb_id: profile.id,
                            name: profile.displayName,
                            photo: profile.photos[0].value,
                            movie_likes: moviesIds
                          }).save(function(err, n) {
                            console.log(n);
                            return done(null, newUser);
                          });
                        } else {
                          // update the list
                          user.movie_likes.concat(moviesIds);
                          user.save(function(err, n) {
                            return done(null, newUser);
                          });
                        }
                      });
                    });
                  });
                });
              });
            });
          });
        });
      }
    });
  }));

}
