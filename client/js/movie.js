var Friend = require('./friend');
var ko = require('knockout');

function Movie(title, youtubeUrl, data) {
    var self = this;
    self.data = data;
    self.youtubeUrl =
        ko.observable("http://www.youtube.com/v/" + youtubeUrl.split('v=')[1] + "?autoplay=1&controls=0&showinfo=0");
    self.title = ko.observable(title);
    self.friends = ko.observableArray();

    self.setFriends = function(friends) {
        self.friends(friends);
    };
}

module.exports = Movie;