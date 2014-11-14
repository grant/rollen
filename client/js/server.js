var Movie = require('./movie');
var Friend = require('./friend');
var $ = require('jquery');

function Server(url) {
    var DISABLED = true;
    var self = this;

    self.getNextTrailers = function(callback) {
        $.get('/get_movies', function(data) {
            var movies = [];
            for (var i = 0; i < data.queue.length; i++) {
                var movie = data.queue[i];
                movies.push(new Movie(movie.title, movie.trailer, movie.overview, movie.poster, movie));
            }

            callback(movies);
        });
    };

    self.likeMovie = function(movieObject, callback) {
        $.post('/liked', {movie : movieObject.data}, function(data) {
            if (data.response === 'fail') {
                callback(false);
            }

            callback(true);
        });
    };

    self.getFriendsWhoLiked = function(movieObject, callback) {
        $.get('/friends_like_too', {movie_tmdb : movieObject.data.tmdb_id}, function(data) {
            var friends = [];
            for (var i = 0; i < data.friends.length; i++) {
                var friend = data.friends[i];
                friends.push(new Friend(friend.fb_id, friend.name, friend.photo, friend));
            }

            callback(friends);
        });
    };

    self.makeEvent = function(eventTitle, callback) {
        console.log(eventTitle);
        $.post('/make_event', {title : eventTitle}, function(data) {
            // URL OF THE EVENT
            callback(data.event);
        });
    };

    self.recommend = function(friend, movieObject, callback) {
        $.post('/recommend', {to_fb_id : friend.facebookID, movie : movieObject.data}, function(data) {
            if (data.response === 'fail') {
                callback(false);
            }

            callback(true);
        });
    };

    // RETURNS AN ARRAY OF {NAME, ID}
    self.search = function(friendName, callback) {
        $.get('/search', {text : friendName}, function(data) {
            var friends = [];
            for (var i = 0; i < data.results.length; i++) {
                var friend = data.results[i];
                friends.push(new Friend(friend.id, friend.name, null, friend));
            }

            callback(friends);
        });
    };

    // RETURNS THE USERS LIKE
    self.getLikes = function(callback) {
        $.get('/all_likes', function(data) {
            var movies = [];
            for (var i = 0; i < data.result.length; i++) {
                var movie = data.result[i];
                movies.push(new Movie(movie.title, movie.trailer, movie.overview, movie.poster, movie));
            }

            callback(movies);
        });
    };
}

module.exports = Server;
