var Promise = require('bluebird');
var request = require('request');
var twitter = require('./../actions/twitter');

var db = require('orchestrate')("94e01e36-60c0-42f6-a3e8-826fe56c5057");

request = Promise.promisify(request);

var wolfram = require('./../actions/wolfram');

var funcs = {
  'text': function(text, userNumber) {

    console.log("query", text);

    var query = encodeURIComponent(text);

    var options = {
      url:  'https://api.wit.ai/message?v=20140528&q='+query,
      headers: {
        'Authorization': 'Bearer TE4IZYGQG7ZR2CBQE4RYZGKDNYYSIVDA'
      }
    }

    return request(options)
    .spread(function(response, body){
      var data = JSON.parse(body);
      //console.log('body', data.outcome);
      return data.outcome;
    })
    .then(function(outcome){
      console.log("outcome", outcome);
      switch(outcome.intent){
        case 'wikipedia':
        case 'wolfram':
          console.log((outcome.entities.wikipedia_search_query) ? outcome.entities.wikipedia_search_query.body : outcome.entities.wolfram_search_query.body);
          return (outcome.entities.wikipedia_search_query) ? wolfram(outcome.entities.wikipedia_search_query.body) : wolfram(outcome.entities.wolfram_search_query.body);
        case 'tweet': {
          if(userNumber) {
            return findTwitTokens(userNumber).spread(function(token, secret, userId){
              return twitter[outcome.intent](token, secret, outcome.entities.message_body.body);
            })
            .then(function(result){
              return "New Tweet : " + outcome.entities.message_body.body;
            })
            .catch(function(err){
              return "Sorry an Error occurred. Try again later";
            });
          } else if(req.session.passport && req.session.passport.user) {
            return twitter[outcome.intent](req.session.passport.user.token, req.session.passport.user.tokenSecret, outcome.entities.message_body.body);
          } else {
            return "Sorry, you need to log in.";
          }
        }

        case 'twitter_timeline': {
          if(userNumber) {
            return findTwitTokens(userNumber).spread(function(token,secret, userId){
              return twitter[outcome.intent](token, secret, (outcome.entities.number ? outcome.entities.number.body : 0));
            })
            .catch(function(err){
              return "Sorry an Error occurred. Try again later";
            });
          } else if(req.session.passport && req.session.passport.user) {
            return twitter[outcome.intent](req.session.passport.user.token, req.session.passport.user.tokenSecret, (outcome.entities.number ? outcome.entities.number.body : 0));
          } else {
            return "Sorry, you need to log in.";
          }
        }

        case 'read_tweets': {
          if(userNumber) {
            return findTwitTokens(userNumber).spread(function(token,secret, userId){
              return twitter[outcome.intent](token, secret, userId, (outcome.entities.number ? outcome.entities.number.body : 0));
            })
            .catch(function(err){
              return "Sorry an Error occurred. Try again later";
            });
          } else if(req.session.passport && req.session.passport.user) {
            return twitter[outcome.intent](req.session.passport.user.token, req.session.passport.user.tokenSecret, userId, (outcome.entities.number ? outcome.entities.number.body : 0));
          } else {
            return "Sorry, you need to log in.";
          }
        }

        default: return 'I don\'t understand ' + text;
      }
    })


  },

  'voice': function(audioFile){

  }

};

function findTwitTokens(phoneNumber){
  return db.search("users", phoneNumber).then(function(user){
    if(user.body.results.length < 1){
      throw new Error("can't decide");
    }
    user = user.body.results[0].value;
    return [user.token, user.tokenSecret, user.id];
  });
}

module.exports = funcs;

//findTwitTokens("17349453112").then(console.log.bind(console));


// funcs.text('What is a snail?');