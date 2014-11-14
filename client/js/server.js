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
}

module.exports = Server;