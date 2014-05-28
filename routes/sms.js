var hitWit = require('./hitWit');
var nexmoSend = require('./nexmo');
var Promise = require('bluebird');

module.exports = function(req, res){
  console.log(req.query.text);
  var text = req.query.text;
  var userNumber = req.query.msisdn;
  var ourNumber = req.query.to;

  hitWit.text(text,userNumber).then(function(response){
    if(typeof response === 'string') {
      return nexmoSend(ourNumber, userNumber, response);
    } else if(Array.isArray(response) && typeof response[0] === 'string') {
      // return (new Promise(function(resolve, reject){
      //   resolve(response);
      // })).map(function(tweet){
      //   return nexmoSend(ourNumber, userNumber, tweet);
      // });
      var smses = response.map(function(tweet){
        return nexmoSend(ourNumber, userNumber, tweet);
      });
      return Promise.all(smses);
    }
  })
  .catch(function(err){
    console.warn(err);
  });

  res.send(200,'success');
};