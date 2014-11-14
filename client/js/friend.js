var ko = require('knockout');

function Friend(name, profilePicture) {
    var self = this;

    self.name = ko.observable(name);
    self.profilePicture = ko.observable(profilePicture);
}

module.exports = Friend;