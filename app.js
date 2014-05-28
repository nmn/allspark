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
var Twit = require('twit');

var routes = require('./routes/index');
var login = require('./routes/login');
var search = require('./routes/search');
var sms = require('./routes/sms');
var nexmo = require('./routes/nexmo');

var db = require('orchestrate')(process.env.ORCHESTRATE_TOKEN || ENV.ORCHESTRATE_TOKEN);

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
app.get('/sms', sms);
app.post('/search', search);
app.post('/nexmo', nexmo);

app.get('/tweet/testers', function(req, res){
  var userToken = req.session.passport.user.token;
  var tokenSecret = req.session.passport.user.tokenSecret;
});

///////////here is how you get the token and token secret out of the session
// app.get('/session/profile/test', function(req, res){
  // res.send(req.session.passport.user.token);
// });

//twitter passport implementation
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY || ENV.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || ENV.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL || ENV.TWITTER_CALLBACK_URL
  },

  function(token, tokenSecret, profile, done) {
    // console.log("twitterProfile", profile);
    // console.log("twitterProfileID", profile.id);
    console.log('token', token);
    console.log('tokenSecret ', tokenSecret);
    console.log('consumerSecret', ENV.TWITTER_CONSUMER_SECRET);

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
