(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Server = require('./server');
var Friend = require('./friend');
var Movie = require('./movie');

function AppViewModel() {
    // PRIVATE
    var API_URL = 'localhost';
    var self = this;
    var server = new Server(API_URL);

    var flipCard = function() {
        // DO JQUERY FLIP HERE
    };

    var nextCard = function() {
        // DO JQUERY DISCARD HERE

    };

    // PUBLIC
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
},{"./friend":3,"./movie":4,"./server":5}],2:[function(require,module,exports){
var AppViewModel = require('./appviewmodel');

ko.applyBindings(new AppViewModel());
},{"./appviewmodel":1}],3:[function(require,module,exports){
function Friend() {
    var self = this;
}

module.exports = Friend;
},{}],4:[function(require,module,exports){
function Movie() {

}

module.exports = Movie;
},{}],5:[function(require,module,exports){
function Server() {
    var self = this;

    self.getNextTrailer = function() {

    };
}

module.exports = Server;
},{}]},{},[2])