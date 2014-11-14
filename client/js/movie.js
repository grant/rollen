var Friend = require('./friend');
var ko = require('knockout');

function Movie(friends, title, youtubeUrl, length) {
    var self = this;
    self.friends = ko.observableArray(friends);
    self.youtubeUrl = ko.observable(youtubeUrl);
    self.title = ko.observable(title);
    self.movieLength = ko.observable(length);
}

module.exports = Movie;