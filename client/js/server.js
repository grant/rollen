var Movie = require('./movie');

function Server(url) {
    var self = this;

    self.getNextTrailers = function(callback) {
        $.get('/get_movies', function(data) {
            var movies = [];
            for (var i = 0; i < data.queue.length; i++) {
                var movie = data.queue[i];
                movies.push(new Movie(movie.title, movie.trailer));
            }

            callback(movies);
        });
    };

    self.getFriendsWhoLiked = function(movieID, callback) {
        $.get('/friends_like_too', {movie_tmdb : movieID}, function(data) {
            var friends = [];
            for (var i = 0; i < data.friends.length; i++) {
                var friend = data.friends[i];
                friends.push(new Friend(friend.fb_id, friend.name, friend.photo));
            }

            callback(friends);
        });
    };
}

module.exports = Server;