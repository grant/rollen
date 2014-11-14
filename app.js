var express = require('express'),       // the main ssjs framework
    routes = require('./routes'),       // by default, brings in routes/index.js
    path = require('path'),             // for pathn manipulation
    db = require('./config/db'),        // database connection
    passport = require('passport'),     // for user authentication
    auth = require('./config/middlewares/authorization'), // helper methods for authentication
    constants = require('./config/constants'),
    app = express(),                    // create an express app
    RedisStore = require('connect-redis')(express); // for persistent sessions


var redis;
var redisURI = process.env.MONGOLAB_URI || 'redis://redistogo:57028c3a314873902459d1407db1657e@greeneye.redistogo.com:11571/';
if (redisURI) {
    console.log("using reditogo");
    rtg   = require('url').parse(redisURI);
    redis = require('redis').createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(':')[1]); // auth 1st part is username and 2nd is password separated by ":"
} else {
    console.log("using local redis");
    redis = require("redis").createClient();
}

app.configure(function(){
    app.set('port', process.env.PORT || 8888);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(function(req, res, next) {
        if (req.url != '/favicon.ico') {
            return next();
        } else {
            res.status(200);
            res.header('Content-Type', 'image/x-icon');
            res.header('Cache-Control', 'max-age=4294880896');
            res.end();
        }
    });
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({
        secret: 'YOLO',
        store: new RedisStore({ client: redis })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

app.get('/', routes.index);
app.get('/app', routes.app);

app.get('/auth/facebook', passport.authenticate("facebook", {scope: ['email', 'user_likes', 'create_event']}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/auth/error' }), routes.authSuccess);
app.get('/auth/error', routes.authError);

// returns the 3 movies in the queue
app.get('/get_movies', auth.requiresLogin, routes.getMovies);
// POST and send the movie object. Reorders the queue based on this like
app.post('/liked', auth.requiresLogin, routes.movieLiked);
// GET all friends who have liked this movie too
app.get('/friends_like_too', auth.requiresLogin, routes.getFriendsWhoLike);

// make the event for this movie
app.post('/make_event', auth.requiresLogin, routes.makeEvent);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

require('./config/pass.js')(passport);

var server = require('http').createServer(app);
server.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));
