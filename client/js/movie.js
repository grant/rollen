var Friend = require('./friend');
var ko = require('knockout');

function Movie(title, youtubeUrl, summary, posterUrl, data) {
    var self = this;
    self.data = data;
    self.youtubeUrl =
        ko.observable("http://www.youtube.com/embed/" + youtubeUrl.split('v=')[1] + "?autoplay=1&controls=0&showinfo=0&enablejsapi=1");
    self.title = ko.observable(title);
    self.friends = ko.observableArray([]);
    self.summary = ko.observable(summary);
    self.posterUrl = ko.observable(posterUrl);
    self.eventCreated = ko.observable(false);
    self.eventPage = ko.observable("");
    self.showDetails = ko.observable(false);

    self.setFriends = function(friends) {
        self.friends(friends);
    };

    self.setEventCreated = function(b) {
        self.eventCreated(b);
    };

    self.setEventPage = function(s) {
        self.eventPage(s);
    };
}

module.exports = Movie;