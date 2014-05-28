var hitWit = require('./hitWit');
var nexmoSend = require('./nexmo');
var Promise = require('bluebird');


module.exports = function(req,res){
  console.log("query",req.query);
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



  res.set('content-type', 'text/xml');
  res.render('vxmlresponse',{});
}