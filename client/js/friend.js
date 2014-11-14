var ko = require('knockout');

function Friend(facebookID, name, photoURL, data) {
    var self = this;
    self.data = data;
    self.facebookID = ko.observable(facebookID);
    self.name = ko.observable(name);
    self.photoURL = ko.observable(photoURL);
}

module.exports = Friend;