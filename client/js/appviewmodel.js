// var Server = require('./server');
// var Friend = require('./friend');
// var Movie = require('./movie');
// var FlashMessage = require('./flashmessage');
// var ko = require('knockout');
// var $ = require('jquery');


// function AppViewModel() {
//   // PRIVATE
//   //-------------
//   var API_URL = 'localhost';
//   var LEFT = 37;
//   var RIGHT = 39;


//   var ACCESS_TOKEN = $('#access-token').text();
//   var self = this;
//   var server = new Server(API_URL);
//   var flash = new FlashMessage('flash', 2000);

//   var disableSwipe = false;

//   var movies = [];

//   var getCurrentCard = function() {
//     if (self.showFirstCard()) {
//       return $('.card-one');
//     } else {
//       return $('.card-two');
//     }
//   };

//   var onShowDetail = function() {
//     self.showDetails(true);
//   };

//   var nextCard = function() {
//     disableSwipe = true;
//     $('.wrapper').animate({'top' : '0'}, 1000, function() {
//       console.log('Moved card off screen: done');

//       self.showFirstCard(!self.showFirstCard());

//       server.getNextTrailer(function(movie) {
//         // Dequeue current movie
//         movies.shift();

//         // Update current movie and shift in the new movie
//         self.onNewMovie(movie);
//       });

//       // Move the new card down
//       getCurrentCard().animate({'top' : '0'}, 1000, function() {
//         console.log('Moved new card on screen: done');
//         disableSwipe = false;
//       });
//     });
//   };

//   var flipCard = function() {
//     self.showDetails(!self.showDetails());
//   };

//   // PUBLIC
//   //-------------
//   self.currentMovie = ko.observable(null);
//   self.showFirstCard = ko.observable(true);
//   self.showDetails = ko.observable(false);

//   self.onNewMovie = function(movie) {
//     // Push in the new movie and update the current pointer
//     movies.push(movie);
//     self.currentMovie(movies[movies.length - 1]);
//     console.log(movies);
//   };

//   self.onRight = function() {
//     if (!disableSwipe) {
//       // First "Yes" flip
//       if (!self.showDetails()) {
//         flipCard();
//       } else { // Next card
//         self.onLeft();
//       }
//     }
//   };

//   self.onLeft = function() {
//     if (!disableSwipe) {
//       nextCard();
//     }
//   };

//   // INIT
//   //-------------

//   flash.setMessage("Loading...");
//   flash.flash();

//   $(document).keydown(function (e) {
//     if(e.which == LEFT) {
//       self.onLeft();
//     } else if(e.which == RIGHT) {
//       self.onRight();
//     }
//     return true;
//   });

//   server.getNextTrailer(function(movie) {
//     // Stop loading screen
//     $('.wrapper').css({'top' : -$('.wrapper').height() / 2});
//     $('.wrapper').show();

//     // Load the movie into the queue
//     self.onNewMovie(movie);

//     // Grab another movie (preload)
//     server.getNextTrailer(function(movie) {
//       // Load the movie into the queue

//       self.onNewMovie(movie);

//       flash.setMessage("Welcome!");
//       flash.flash();
//     });
//   });
// }

// module.exports = AppViewModel;