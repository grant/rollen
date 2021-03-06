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

  // Queue for movies
  var movies = [];


  var getViewableMovieObv = function() {
      if (!self.firstMovie()) {
          return self.nextMovie;
      } else {
          return self.currentMovie;
      }
  };

    var getHiddenMovieObv = function() {
        if (self.firstMovie()) {
            return self.nextMovie;
        } else {
            return self.currentMovie;
        }
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
    if (!self.firstMovie()) {
      self.nextMovie(movies[0]);
    } else {
      self.currentMovie(movies[0]);
    }
    // console.log(self.currentMovie());
    // console.log(self.nextMovie());
    // console.log(movies);
  };

  // DOM stuff for moving to the next frame
  // Called when preparing to move the film-reel to the next frame
  var nextCard = function() {
    disableSwipe = true;
    console.log('next card');
    $('.make-event-button').show();
    self.instaFriendList([]);
    self.partialFriendName("");
    nextMovie();
    $('.film-roll').animate({
      'top': '0'
    }, 1000, function() {
      console.log('New card down: done');
      getHiddenMovieObv()(null);
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
    var rotationSpeed = 10;
    function rotateForward () {
      // manually rotate until done
      var rotation = 0;
      var id = setInterval(function () {
        rotation += rotationSpeed;
        $('.film-roll').css('transform', 'rotateY('+rotation+'deg)');
        if (rotation > 90) {
          clearInterval(id);
          // change data
            getViewableMovieObv()().showDetails(!getViewableMovieObv()().showDetails());
          // rotate back
          rotateBackward();
        }
      }, 30);
    }

    function rotateBackward () {
      // manually rotate until done
      var rotation = 90;
      var id = setInterval(function () {
        rotation -= rotationSpeed;
        $('.film-roll').css('transform', 'rotateY('+rotation+'deg)');
        if (rotation < 0) {
          clearInterval(id);
          // fix rotation
          $('.film-roll').css('transform', 'rotateY(0)');
        }
      }, 30);
    }
    
    rotateForward();
  };

  // PUBLIC
  //-------------
  self.currentMovie = ko.observable(null);
  self.nextMovie = ko.observable(null);
  self.firstMovie = ko.observable(true);
  self.makeEventName = ko.observable("");
  self.instaFriendList = ko.observableArray([]);
  self.partialFriendName = ko.observable("");
  self.likedMovies = ko.observableArray([]);
  self.showOverlay = ko.observable(false);

  self.onClickProfile = function() {
    self.showOverlay(true);
    server.getLikes(function(data) {
        console.log('GOT LIKES');
        console.log(data);
      self.likedMovies(data);
    });
  };

  self.onCloseOverlay = function() {
    self.showOverlay(false);
  };

  self.onSetMovie = function(movie) {
    self.showOverlay(false);
    getViewableMovieObv()(movie);
  };

  self.onSearchFriend = function() {
    console.log(self.partialFriendName());
    if (self.partialFriendName() != "") {
        server.search(self.partialFriendName(), function(friends) {
            self.instaFriendList(friends.slice(0,10));
        });
    }
    return true; // allow typing
  };

    self.onRecommendFriend = function(friend, movie) {
        if (confirm("Really recommend?")) {
            server.recommend(friend, movie, function(success) {
            });
        }
    };

  // Event handler for liking a movie
  self.onLikeMovie = function() {
    flipCard();
    server.likeMovie(getViewableMovieObv()(), function(success) {
    });
  };

  // Event handler for liking a movie
  self.onCreateEvent = function(movie) {
    if(self.makeEventName() != "") {
      $('.make-event-button').hide();
      server.makeEvent(self.makeEventName(), function(event) {
          console.log(event);
          // TODO: show event url
          movie.setEventPage(event);
          movie.setEventCreated(true);
          $('.event-prompt').fadeOut(500, 'swing', function() {
            $('.event-link').css({'opacity': 1});
          })
      });
    }
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
      if (!getViewableMovieObv()().showDetails()) {
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

    // Set data bindings to movies (null means blank)
    self.currentMovie(movies[0]);
    self.nextMovie(null);
  });


  // Leap Motion
  if (typeof(Leap) !== 'undefined') {
    console.log('leap');
    var controller = new Leap.Controller({enableGestures: true});

    controller.on('gesture', function(gesture) {
      if (gesture.type === 'swipe') {
        handleSwipe(gesture);
      }
    });

    function handleSwipe(swipe){
      var startFrameID;
      if (swipe.state === 'stop'){
        if (swipe.direction[0] > 0){
          //this means that the swipe is to the right direction
          self.onRight();
        } else {
          //this means that the swipe is to the left direction
          self.onLeft();
        }
      }
    }

    controller.connect();
  }
}

module.exports = AppViewModel;
