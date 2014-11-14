/*
    Holds app-wide constants.
    Usage:
        var Constants = require(./config/Constants);
        console.log(Constants.APP_NAME);
*/

var Constants = {
    // The name of the app
    APP_NAME: "Rollen",
    // Appid and secret are used to connect with facebook app, can't be shared
    Facebook: {
        APPID : '496630153783922',
        SECRET : '777565cc0f54529a51ffd42ea999dd63',
        CALLBACK : 'http://localhost:8888/auth/facebook/callback',
        // CALLBACK : 'http://rollen.co/auth/facebook/callback'
    },
    TRAK_KEY: 'e1d030d77ab29d7fb5a18abe94b7572d',
    TMDB_KEY: '89cd5483c3ac6ccbf96482f05b8ca830',
};

module.exports = Constants;
