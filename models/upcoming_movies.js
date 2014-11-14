var mongoose = require('mongoose'),
  Schema = mongoose.Schema, // Each schema maps to a MongoDB collection
  Constants = require('../config/constants');


var upcomingMoviesSchema = new Schema({
  tmdb_id: String,
  imdb_id: String,
  genres: [String],
  title: String,
  directors: [String],
  actors: [String],
  trailer: String,
  overview: String,
  poster: String,
  url: String,
  tagline: String,
  release_date: String
});

module.exports = mongoose.model('UpcomingMovies', upcomingMoviesSchema);
