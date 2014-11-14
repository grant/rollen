// Ranks the upcoming movies against the user's likes (movie_likes)

var User = require('./../models/user');
var UserLikes = require('./../models/user_likes');
var UpcomingMovies = require('./../models/upcoming_movies');

var GENRE_AMOUNT = 1;
var DIRECTOR_AMOUNT = 1;
var ACTOR_AMOUNT = 1;
var FRIEND_AMOUNT = 1;

function computeSimilarity(array, otherArray, score) {
    var result = 0;

    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (otherArray.indexOf(item) !== -1) {
            result += score;
        }
    }

    return result;
}

module.exports = function(user, callback) {
    console.log(user);
    UpcomingMovies.find({}, function(error, movies) {
        if (error) {
            callback(null);
        }

        var rankedData = []; // List of movie objects in the correct order (highest rank to lowest)
        for (var i = 0; i < movies.length; i++) {
            var movie = movies[i];
            // Check to see that this movie has not already been seen
            if (user.seen && user.seen.indexOf(movie) === -1) {
                // movie_score = max_{a \in movie_likes} similarity(a, movie)
                var bestScore = 0;
                for (var j = 0; j < user.movie_likes.length; j++) {
                    var likedMovie = user.movie_likes[j];
                    var genreScore = computeSimilarity(movie.genres, likedMovie.genres, GENRE_AMOUNT);
                    var directorScore = computeSimilarity(movie.directors, likedMovie.directors, DIRECTOR_AMOUNT);
                    var actorScore = computeSimilarity(movie.actors, likedMovie.actors, ACTOR_AMOUNT);
                    var score = genreScore + directorScore + actorScore;

                    if (score > bestScore) {
                        bestScore = score;
                    }
                }

                // Increase the score if recommended by a friend
                if (movie.recommended_by != "us") {
                    bestScore += FRIEND_AMOUNT;
                }

                rankedData.push({score : bestScore, data : movie});
            }
        }

        // Sort the data by the scores
        rankedData.sort(function(a, b) {
            return b.score - a.score;
        });

        // Grab the final objects and ignore the scores
        data = [];
        for (var i = 0; i < rankedData.length; i++) {
            movieScore = rankedData[i];
            data.push(movieScore.data);
        }

        user.queue = data;
        user.save(function(error, newUser) {
            if (error) {
                callback(null);
            }

            callback(newUser);
        });
    });
};
