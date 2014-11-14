var Movie = require('./movie');

function Server(url) {
    var self = this;

    self.getNextTrailers = function(callback) {
        $.get('/get_movies', function(data) {
            var movies = [];
            for (var i = 0; i < data.queue.length; i++) {
                var movie = data.queue[i];
                movies.push(new Movie(movie.title, movie.trailer, movie));
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
}

module.exports = Server;