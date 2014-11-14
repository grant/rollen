var Friend = require('./friend');
var ko = require('knockout');

function Movie() {
    var self = this;
    self.friends = ko.observableArray([]);
}

module.exports = Movie;