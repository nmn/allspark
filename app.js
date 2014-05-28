var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var twitterService = require('./actions/twitter');
var multer = require('multer');

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var EvernoteStrategy = require('passport-evernote').Strategy;

//var ENV = require('./env.js');

var routes = require('./routes/index');
var login = require('./routes/login');
var search = require('./routes/search');
var sms = require('./routes/sms');
var nexmo = require('./routes/nexmo');
var voice = require('./routes/voice');


var db = require('orchestrate')(process.env.ORCHESTRATE_TOKEN);

var app = express();

app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(multer({dest: './uploads/'}));

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
app.get('/vxml', function(req,res){
    res.set('content-type', 'text/xml');
    res.render('vxml',{});
});
app.post('/voice', voice);

//EVERNOTE
// GET /auth/evernote
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Evernote authentication will involve redirecting
//   the user to evernote.com.  After authorization, Evernote will redirect the user
//   back to this application at /auth/evernote/callback
app.get('/auth/evernote',
  passport.authenticate('evernote'),
  function(req, res){
    // The request will be redirected to Evernote for authentication, so this
    // function will not be called.
  });

// GET /auth/evernote/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/evernote/callback', 
  passport.authenticate('evernote', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/tweet/postStatus', function(req,res){
  if(req.session.passport && req.session.passport.user){
    twitterService.postTweet(req.session.passport.user.token, req.session.passport.user.tokenSecret, 'jello whirled!')
    .then(function(response){
      console.log(response);
      res.send(200);
    })
    .catch(console.log.bind(console));
  } else {
    // throw new Error('passport or passport.user were not defined during a call to the /tweet/postStatus route');
    console.log('passport or passport.user were not defined during a call to the /tweet/postStatus route');
    res.send(500);
  }
});

app.get('/tweet/homeTimeline', function(req,res){
  if(req.session.passport && req.session.passport.user){
    twitterService.getHomeTimeline(req.session.passport.user.token, req.session.passport.user.tokenSecret, 2)
    .then(function(response){
      console.log(response);
      res.send(200);
    })
    .catch(console.log.bind(console));
  } else {
    // throw new Error('passport or passport.user were not defined during a call to the /tweet/homeTimeline route');
    console.log('passport or passport.user were not defined during a call to the /tweet/homeTimeline route');
    res.send(500);
  }
});

app.get('/tweet/userTimeline', function(req,res){
  if(req.session.passport && req.session.passport.user){
    twitterService.getUserTimeline(
      req.session.passport.user.token,
      req.session.passport.user.tokenSecret,
      req.session.passport.user.id, 4)
    .then(function(response){
      console.log(response);
      res.send(200);
    })
    .catch(console.log.bind(console));
  } else {
    // throw new Error('passport or passport.user were not defined during a call to the /tweet/userTimeline route');
    console.log('passport or passport.user were not defined during a call to the /tweet/userTimeline route');
    res.send(500);
  }
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
    // console.log('token', token);
    // console.log('tokenSecret ', tokenSecret);
    // console.log('consumerSecret', ENV.TWITTER_CONSUMER_SECRET);

    profile.token = token;
    profile.tokenSecret = tokenSecret;
    db.put('users', profile.id, profile)
    .then(function(result){
        done(null, profile);
    })
    .fail(done);
  }
));

passport.use(new EvernoteStrategy({
    requestTokenURL: 'https://sandbox.evernote.com/oauth',
    accessTokenURL: 'https://sandbox.evernote.com/oauth',
    userAuthorizationURL: 'https://sandbox.evernote.com/OAuth.action',
    consumerKey: process.env.EVERNOTE_CONSUMER_KEY,
    consumerSecret: process.env.EVERNOTE_CONSUMER_SECRET,
    callbackURL: process.env.EVERNOTE_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    // db.put('notes', )
    db.put('notes', profile.id, profile)
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
