var Server = require('./server');
var Friend = require('./friend');
var Movie = require('./movie');

function AppViewModel() {
    var API_URL = 'localhost';
    var self = this;

    var server = new Server(API_URL);

    var flipCard = function() {
        // DO JQUERY FLIP HERE
    };

    var nextCard = function() {
        // DO JQUERY DISCARD HERE

    };

    self.currentFriends = ko.observableArray([]);

    self.onNewMovie = function(movie) {

    };

    self.onRightSwipe = function() {
        flipCard();
    };

    self.onLeftSwipe = function() {
        nextCard();
    };
}

module.exports = AppViewModel;