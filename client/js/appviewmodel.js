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

  // server.search(function("Ryan", data) {
  //   console.log(data);
  // });
  //  throw "die";

  var disableSwipe = false;

  // Queue for movies
  var movies = [];

  var pauseNextVideo = function(state) {
    var iframe = document.getElementsByTagName("iframe")[1].contentWindow;
    func = state ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
  };

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
    self.showDetails(false);
    $('.film-roll').animate({
      'top': '0'
    }, 1000, function() {
      console.log('New card down: done');
      pauseNextVideo(false);
      nextMovie();

      $('.film-roll').css({
        'top': '-100%'
      });
      var $last = $('.frame').last();
      var $first = $('.frame').first();
      $first.before($last);
      pauseNextVideo(true);
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
    server.likeMovie(self.currentMovie(), function(success) {
      flipCard();
    });
  };

  // Event handler for liking a movie
  self.onCreateEvent = function() {
    server.makeEvent(self.makeEventName, function(event) {
      console.log(event);
      // TODO: show event url
    });
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
    pauseNextVideo(true);
      swal("Here's a message!");
  });
}

module.exports = AppViewModel;
