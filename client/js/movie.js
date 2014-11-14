var Friend = require('./friend');
var ko = require('knockout');

function Movie(title, youtubeUrl) {
    var self = this;
    self.youtubeUrl = ko.observable(youtubeUrl);
    self.title = ko.observable(title);
}

module.exports = Movie;