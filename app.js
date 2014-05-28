var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var ENV = require('./env.js');

var routes = require('./routes/index');
var login = require('./routes/login');
var search = require('./routes/search');

var db = require('orchestrate')(ENV.ORCHESTRATE_TOKEN);

var app = express();

app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"namanLikesPakwan"}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', routes);
app.get('/login', login);
app.post('/login', login);
app.get('/search', search);
app.post('/search', search);

//twitter passport implementation
passport.use(new TwitterStrategy({
    consumerKey: ENV.TWITTER_CONSUMER_KEY,
    consumerSecret: ENV.TWITTER_CONSUMER_SECRET,
    callbackURL: ENV.TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    // console.log("twitterProfile", profile);
    // console.log("twitterProfileID", profile.id);
    console.log('token', token);
    console.log('tokenSecret ', tokenSecret);
    console.log('consumerSecret', ENV.TWITTER_CONSUMER_SECRET);
    
    //////use the following line if you are not using a data to store the profile
    // done(null, profile);

    ///////example for saving to database
    // User.findOrCreate(, function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
    profile.token = token;
    profile.tokenSecret = tokenSecret;
    db.put('users', profile.id, profile)
    .then(function(result){
        done(null, profile);
    })
    .fail(done);
  }
));


//serialize user cheat code to use when not saving to a db
passport.serializeUser(function(user, done) {
    // console.log('serializer log', arguments);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
    // console.log('deserializer log', arguments);
  done(null, obj);
});

//twitter auth routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

// module.exports = app;
