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
           });
       }
   };

   var nextMovie = function() {
     self.firstMovie(!self.firstMovie());
     movies.shift();
     maybeGetMoreMovies();
     if (self.firstMovie()) {
       self.nextMovie(movies[1]);
     } else {
       self.currentMovie(movies[1]);
     }
     console.log(self.currentMovie());
     console.log(self.nextMovie());
     console.log(movies);
   };

   var nextCard = function() {
     disableSwipe = true;
     console.log('next card');
     $('.film-roll').animate({'top' : '0'}, 1000, function() {
       console.log('New card down: done');

       nextMovie();

       $('.film-roll').css({'top' : '-100%'});
       var $last = $('.frame').last();
       var $first = $('.frame').first();
       $first.before($last);
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

   self.onLikeMovie = function() {
       flipCard();
//       server.likeMovie(self.currentMovie(), function(success) {
//         flipCard();
//       });
   };

   self.onNewMovies = function(movie) {
     // Push in the new movie and update the current pointer
     movies = movies.concat(movie);

     // Fill in friend fields for each movie
     for(var i = 0; i < movie.length; i++) {
         var currentMovie = movie[i];
         (function(m) {
           server.getFriendsWhoLiked(m, function(friends) {
             m.setFriends(friends);
           });
         })(currentMovie);
     }
   };

   self.onRight = function() {
     if (!disableSwipe) {
       // First "Yes" flip
       if (!self.showDetails()) {
         self.onLikeMovie();
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
     nextMovie();
   });
}

module.exports = AppViewModel;