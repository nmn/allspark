var Twit = require('twit');
var ENV = require('../env');
var Promise = require('bluebird');
// Twit = Promise.promisifyAll('Twit');

module.exports = {
  postTweet: function(token, tokenSecret, tweetMessage){
    var T = new Twit({
      consumer_key: ENV.TWITTER_CONSUMER_KEY,
      consumer_secret: ENV.TWITTER_CONSUMER_SECRET,
      access_token: token,
      access_token_secret: tokenSecret
    });

    T.postAsync = Promise.promisify(T.post.bind(T));
    return T.postAsync('statuses/update', { status: tweetMessage});
  },

  getHomeTimeline: function(token, tokenSecret, numTweets){
    numTweets = (numTweets && numTweets > 0) ? numTweets : 3;
    var T = new Twit({
      consumer_key: ENV.TWITTER_CONSUMER_KEY,
      consumer_secret: ENV.TWITTER_CONSUMER_SECRET,
      access_token: token,
      access_token_secret: tokenSecret
    });
    T.getAsync = Promise.promisify(T.get.bind(T));
    return T.getAsync('statuses/home_timeline', {count:numTweets});
  },

    getUserTimeline: function(token, tokenSecret, userId, numTweets){
    numTweets = (numTweets && numTweets > 0) ? numTweets : 3;
    var T = new Twit({
      consumer_key: ENV.TWITTER_CONSUMER_KEY,
      consumer_secret: ENV.TWITTER_CONSUMER_SECRET,
      access_token: token,
      access_token_secret: tokenSecret
    });
    T.getAsync = Promise.promisify(T.get.bind(T));
    return T.getAsync('statuses/user_timeline', {user_id: userId, count:numTweets});
  },
};