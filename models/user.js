var mongoose = require('mongoose'),
    Schema = mongoose.Schema; // Each schema maps to a MongoDB collection


// For any user
var userSchema = new Schema({
  created_at: {
    // auto added user registration timestamp
    type: Date,
    default: Date.now
  },
  username: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true // force email lowercase
  },
  accessToken: {
    type: String
  },
  name: {
    type: String
  },
  fb_id: String,
  friends: [],  // list of id's
  photo: {
    type: String
  },
  movie_likes: [{   // from fb and liked within the app
    tmdb_id: String,
    imdb_id: String,
    genres: [String],
    title: String,
    directors: [String],
    actors: [String],
    trailer: String,
    url: String,
    release_date: String,
    tagline: String,
    recommended_by: {  // "us" if we recommended or friend's name
      type: String, 
      default: "us"
    }
  }],
  queue: [{   // all recommendations
    tmdb_id: String,
    imdb_id: String,
    genres: [String],
    title: String,
    directors: [String],
    actors: [String],
    trailer: String,
    url: String,
    release_date: String,
    tagline: String,
    recommended_by: {  // "us" if we recommended or friend's name
      type: String, 
      default: "us"
    },
    event_link: String  // has a value if it has a link
  }],
  seen: [Object]
});


module.exports = mongoose.model('User', userSchema);
