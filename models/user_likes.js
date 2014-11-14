var mongoose = require('mongoose'),
  Schema = mongoose.Schema, // Each schema maps to a MongoDB collection
  Constants = require('../config/constants');


var userLikesSchema = new Schema({
  fb_id: String,  // fb id of a user
  movie_likes: [String]  // tmdb id's of movies liked by user
});


module.exports = mongoose.model('UserLikes', userLikesSchema);
