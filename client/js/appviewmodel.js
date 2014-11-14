var Server = require('./server');
var Friend = require('./friend');
var Movie = require('./movie');
var ko = require('knockout');
var $ = require('jquery');


function AppViewModel() {
   // PRIVATE
   //-------------
   var API_URL = 'localhost';
   var LEFT = 37;
   var RIGHT = 39;


   var ACCESS_TOKEN = $('#access-token').text();
   var self = this;
   var server = new Server(API_URL);

   var disableSwipe = false;

   var movies = [];

   var onShowDetail = function() {
     self.showDetails(true);
   };

   var maybeGetMoreMovies = function() {
       if (movies.length < 6) {
           server.getNextTrailers(function(movie) {
               // Update current movie and shift in the new movie
               self.onNewMovies(movie);
               // Update current movie and shift in the new movie
               self.onNewMovie(movie);
           });
       }
   };

   var nextMovie = function() {
     self.firstMovie(!self.firstMovie());
     movies.shift();
     maybeGetMoreMovies();
     if (self.firstMovie()) {
       self.currentMovie(movies[0]);
       self.nextMovie(movies[1]);
     } else {
       self.currentMovie(movies[1]);
       self.nextMovie(movies[0]);
     }
   };

   var nextCard = function() {
     disableSwipe = true;
     console.log('next card');
     $('.film-roll').animate({'top' : '0'}, 1000, function() {
       console.log('New card down: done');

       nextMovie();

       $('.film-roll').css({'top' : '-100%'});
       $('.frame').last().prepend('.film-roll');
       disableSwipe = false;
     });
   };

   var flipCard = function() {
     self.showDetails(!self.showDetails());
   };

   // PUBLIC
   //-------------
   self.currentMovie = ko.observable(null);
   self.nextMovie = ko.observable(null);
   self.firstMovie = ko.observable(true);
   self.showDetails = ko.observable(false);
   self.makeEventName = ko.observable("");

   self.onNewMovies = function(movie) {
     // Push in the new movie and update the current pointer
     movies = movies.concat(movie);

     // Fill in friend fields for each movie
     for(var i = 0; i < movie.length; i++) {
//         server.getFriendsWhoLiked(movie[i], function(friends) {
//            movie[i].setFriends(friends);
//         });
     }
   };

   self.onRight = function() {
     if (!disableSwipe) {
       // First "Yes" flip
       if (!self.showDetails()) {
         flipCard();
       } else { // Next card
         self.onLeft();
       }
     }
   };

   self.onLeft = function() {
     console.log('LEFT');
     if (!disableSwipe) {
       nextCard();
     }
   };

   // INIT
   //-------------

   $(document).keydown(function (e) {
     if(e.which == LEFT) {
       self.onLeft();
     } else if(e.which == RIGHT) {
       self.onRight();
     }
     return true;
   });

   server.getNextTrailers(function(movies) {
     // Load the movie into the queue
     self.onNewMovies(movies);
   });
}

module.exports = AppViewModel;