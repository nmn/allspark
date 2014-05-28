var Promise = require('bluebird');

module.exports = {
  // tweet: function(token, tokenSecret, tweetMessage){
  //   var T = new Twit({
  //     consumer_key: process.env.TWITTER_CONSUMER_KEY,
  //     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  //     access_token: token,
  //     access_token_secret: tokenSecret
  //   });

  //   T.postAsync = Promise.promisify(T.post.bind(T));
  //   return T.postAsync('statuses/update', { status: tweetMessage});
  // }
};