var hitWit = require('./hitWit');
var nexmoSend = require('./nexmo');
var Promise = require('bluebird');


module.exports = function(req,res){
  var string = req.headers.referer;
  var userNumber = string.match(/nexmo_caller_id=([0-9]+)&/)[1];
  var ourNumber = '12153029514';
  var path = req.files.recording.path;

  res.set('content-type', 'text/xml');
  hitWit.text(path, userNumber, undefined, true).then(function(response){
    if(typeof response === 'string') {
      return res.render('vxmlresponse',{prompts : [
        {message: 'The answer is ' + response}
      ]});
      //nexmoSend(ourNumber, userNumber, response);
    } else if(Array.isArray(response) && typeof response[0] === 'string') {
      var messages = response.map(function(prompt){
        return {message: prompt};
      });
      return res.render('vxmlresponse',{prompts : messages});
      // return (new Promise(function(resolve, reject){
      //   resolve(response);
      // })).map(function(tweet){
      //   return nexmoSend(ourNumber, userNumber, tweet);
      // });
    }
  })
  .catch(function(err){
    return res.render('vxmlresponse',{prompts : [
      {message: "Sorry an error occurred."}
    ]});
  });

  console.log(userNumber,path);
};