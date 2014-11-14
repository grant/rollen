var Friend = require('./friend');
var ko = require('knockout');

function Movie(title, youtubeUrl, data) {
    var self = this;
    self.data = data;
    self.youtubeUrl = ko.observable("http://www.youtube.com/v/" + youtubeUrl.split('v=')[1]);
    self.title = ko.observable(title);
}

module.exports = Movie;