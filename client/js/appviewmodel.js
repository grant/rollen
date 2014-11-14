var Server = require('./server');
var Friend = require('./friend');
var Movie = require('./movie');
var ko = require('knockout');
var $ = require('jquery');


function AppViewModel() {
   // PUBLIC
   //-------------
   self.currentMovie = ko.observable(null);
   self.nextMovie = ko.observable(null);
   self.firstMovie = ko.observable(true);
   self.showDetails = ko.observable(false);
   self.makeEventName = ko.observable("");

   self.onLikeMovie = function() {
       server.likeMovie(self.currentMovie(), function(success) {
         flipCard();
       });
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
   });

  // PRIVATE
  //-------------
  var API_URL = 'localhost';
  var LEFT = 37;
  var RIGHT = 39;


  var ACCESS_TOKEN = $('#access-token').text();
  var self = this;
  var server = new Server(API_URL);

  var disableSwipe = false;

  // Queue for movies
  var movies = [];

  var toggleVideo = function(state) {
    // if state == 'hide', hide. Else: show video
    var div = document.getElementById("popupVid");
    var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
    div.style.display = state == 'hide' ? 'none' : '';
    func = state == 'hide' ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
  }

  var onShowDetail = function() {
    self.showDetails(true);
  };

  // Get more movies if below threshold
  var maybeGetMoreMovies = function() {
    if (movies.length < 6) {
      server.getNextTrailers(function(movie) {
        // Update current movie and shift in the new movie
        self.onNewMovies(movie);
      });
    }
  };

  // 1. Remove current movie
  // 2. Get more movies if necessary
  // 3. Reset movie pointers
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

  // DOM stuff for moving to the next frame
  // Called when preparing to move the film-reel to the next frame
  var nextCard = function() {
    disableSwipe = true;
    console.log('next card');
    $('.film-roll').animate({
      'top': '0'
    }, 1000, function() {
      console.log('New card down: done');

      nextMovie();

      $('.film-roll').css({
        'top': '-100%'
      });
      var $last = $('.frame').last();
      var $first = $('.frame').first();
      $first.before($last);
      disableSwipe = false;
    });
  };

  // Shows the movie details
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

  // Event handler for liking a movie
  self.onLikeMovie = function() {
    flipCard();
    //       server.likeMovie(self.currentMovie(), function(success) {
    //         flipCard();
    //       });
  };

  // Event handler for getting new movies
  self.onNewMovies = function(movie) {
    // Push in the new movie and update the current pointer
    movies = movies.concat(movie);

    // Fill in friend fields for each movie
    for (var i = 0; i < movie.length; i++) {
      var currentMovie = movie[i];
      (function(m) {
        server.getFriendsWhoLiked(m, function(friends) {
          m.setFriends(friends);
        });
      })(currentMovie);
    }
  };

  // Event handler for pressing right arrow key
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

  // Event handler for pressing right arrow key
  self.onLeft = function() {
    console.log('LEFT');
    if (!disableSwipe) {
      nextCard();
    }
  };

  // INIT
  //-------------

  // Keyboard bindings
  $(document).keydown(function(e) {
    if (e.which == LEFT) {
      self.onLeft();
    } else if (e.which == RIGHT) {
      self.onRight();
    }
    return true;
  });

  // Gets first movies for queue
  server.getNextTrailers(function(data) {
    // Load the movie into the queue
    self.onNewMovies(data);

    // Set data bindings to movies
    self.currentMovie(movies[0]);
    self.nextMovie(movies[1]);
  });
}

module.exports = AppViewModel;