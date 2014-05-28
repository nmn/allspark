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
    } else if(Array.isArray(response)) {
      response = response.filter(function(tweet){
        return typeof tweet === 'string';
      });
      if(response.length > 1) {
        // return (new Promise(function(resolve, reject){
        //   resolve(response);
        // })).map(function(tweet){
        //   return nexmoSend(ourNumber, userNumber, tweet);
        // });
        var smses = [];
        for(var i = 0; i < response.length; i++){
          console.log('trying to send...', response[i]);
          smses.push(nexmoSend(ourNumber, userNumber, response[i]));
        }
        return Promise.all(smses);
      } else if (response.length === 1) {
        nexmoSend(ourNumber, userNumber, response[0])
      } else {
        return nexmoSend(ourNumber, userNumber, 'Some strange error occurred');
      }
    }
    else {
      return nexmoSend(ourNumber, userNumber, 'Some strange error occurred');
    }
  })
  .catch(function(err){
    console.warn(err);
  });

  res.send(200,'success');
};