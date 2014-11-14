var Movie = require('./movie');

function Server(url) {
    var self = this;

    self.getNextTrailer = function(callback) {
        // TODO: SERVER COMMAND THEN CONSTRUCT NEW MOVIE OBJECT AND RETURN THROUGH CALLBACK
        callback(new Movie());
    };
}

module.exports = Server;