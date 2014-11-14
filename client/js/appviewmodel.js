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
       server.getNextTrailers(function(movie) {
           // Dequeue current movie

           // Update current movie and shift in the new movie
           self.onNewMovie(movie);
       });
   };

   var nextCard = function() {
     disableSwipe = true;
     console.log('next card');
     $('.film-roll').animate({'top' : '0'}, 1000, function() {
       console.log('New card down: done');

       movies.shift();
       maybeGetMoreMovies();

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
   self.showDetails = ko.observable(false);
   self.makeEventName = ko.observable("");

   self.onNewMovie = function(movie) {
     // Push in the new movie and update the current pointer
     movies.push(movie);
     self.currentMovie(movies[movies.length - 1]);
     console.log(movies);
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

   server.getNextTrailer(function(movie) {
     // Stop loading screen
     $('.wrapper').css({'top' : -$('.wrapper').height() / 2});
     $('.wrapper').show();

     // Load the movie into the queue
     self.onNewMovie(movie);

     // Grab another movie (preload)
     server.getNextTrailer(function(movie) {
       // Load the movie into the queue

       self.onNewMovie(movie);
     });
   });
}

module.exports = AppViewModel;