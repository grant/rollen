var Server = require('./server');
var Friend = require('./friend');
var Movie = require('./movie');
var FlashMessage = require('./flashmessage');
var ko = require('knockout');

function AppViewModel() {
    // PRIVATE
    var API_URL = 'localhost';
    var LEFT = 37;
    var RIGHT = 39;


    var ACCESS_TOKEN = $('#access-token').html();
    var self = this;
    var server = new Server(API_URL);


    var flipCard = function() {
        // DO JQUERY FLIP HERE
    };

    var nextCard = function() {
        // DO JQUERY DISCARD HERE
        server.getNextTrailer(self.onNewMovie);
    };

    // PUBLIC
    self.currentFriends = ko.observableArray([]);

    self.onNewMovie = function(movie) {

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