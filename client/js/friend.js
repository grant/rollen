var ko = require('knockout');

function Friend(facebookID, name, photoURL) {
    var self = this;
    self.facebookID = ko.observable(facebookID);
    self.name = ko.observable(name);
    self.photoURL = ko.observable(photoURL);
}

module.exports = Friend;