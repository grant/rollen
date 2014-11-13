var Server = require('./server');
var Friend = require('./friend');
var Movie = require('./movie');
var FlashMessage = require('./flashmessage');
var ko = require('knockout');
var $ = require('jquery');

function AppViewModel() {
    // PRIVATE
    var API_URL = 'localhost';
    var LEFT = 37;
    var RIGHT = 39;


    var ACCESS_TOKEN = $('#access-token').text();
    var self = this;
    var server = new Server(API_URL);

    var movies = [];


    var flipCard = function() {

    };

    var nextCard = function() {
        // DO JQUERY DISCARD HERE
        $('.card-one').slideDown();
        server.getNextTrailer(function(movie) {
            self.onNewMovie(movie);
            movies.shift();
            self.currentMovie(movies[movies.length - 1]);
        });
    };

    // PUBLIC
    self.currentFriends = ko.observableArray([]);
    self.currentMovie = ko.observable(null);
    self.showFirstCard = ko.observable(true);
    self.showDetails = ko.observable(false);

    self.onNewMovie = function(movie) {
        movies.push(movie)
    };

    self.onRight = function() {
        flipCard();
    };

    self.onLeft = function() {
        nextCard();
    };

    // INIT
    $(document).keydown(function (e) {
        if(e.which == LEFT) {
            self.onLeft();
        } else if(e.which == RIGHT) {
            self.onRight();
        }
        return true;
    });
}

module.exports = AppViewModel;