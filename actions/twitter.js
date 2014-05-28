var Twit = require('twit');
//var ENV = require('../env');
var Promise = require('bluebird');
// Twit = Promise.promisifyAll('Twit');

module.exports = {
  tweet: function(token, tokenSecret, tweetMessage){
    if(tweetMessage.length < 130)
      tweetMessage += ' #apiconsf';

    console.log('trying to tweet', tweetMessage);
    var T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: token,
      access_token_secret: tokenSecret
    });

    T.postAsync = Promise.promisify(T.post.bind(T));
    return T.postAsync('statuses/update', { status: tweetMessage});
  },

  twitter_timeline: function(token, tokenSecret, numTweets){
    numTweets = (numTweets && numTweets > 0) ? numTweets : 3;
    var T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: token,
      access_token_secret: tokenSecret
    });
    T.getAsync = Promise.promisify(T.get.bind(T));
    return T.getAsync('statuses/home_timeline', {count:numTweets});
  },

    read_tweets: function(token, tokenSecret, userId, numTweets){
    numTweets = (numTweets && numTweets > 0) ? numTweets : 3;
    var T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: token,
      access_token_secret: tokenSecret
    });
    T.getAsync = Promise.promisify(T.get.bind(T));
    return T.getAsync('statuses/user_timeline', {user_id: userId, count:numTweets});
  },
};