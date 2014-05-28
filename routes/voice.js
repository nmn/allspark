var hitWit = require('./hitWit');
var nexmoSend = require('./nexmo');
var Promise = require('bluebird');


module.exports = function(req,res){
  var string = req.headers.referer;
  var userNumber = string.match(/nexmo_caller_id=([0-9]+)&/)[1];
  var ourNumber = '12153029514';
  var path = req.files.recording.path;

  // hitWit.voice(path).then(function(response){
  //   if(typeof response === 'string') {
  //     return nexmoSend(ourNumber, userNumber, response);
  //   } else if(Array.isArray(response) && typeof response[0] === 'string') {
  //     return (new Promise(function(resolve, reject){
  //       resolve(response);
  //     })).map(function(tweet){
  //       return nexmoSend(ourNumber, userNumber, tweet);
  //     });
  //   }
  // })
  // .catch(function(err){
  //   console.warn(err);
  // });
console.log(userNumber,path);
  res.set('content-type', 'text/xml');
  res.render('vxmlresponse',{});
}