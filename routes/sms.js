var hitWit = require('./hitWit');
var nexmoSend = require('./nexmo');

module.exports = function(req, res){
  console.log(req.query.text);
  var text = req.query.text;
  var userNumber = req.query.msisdn;
  var ourNumber = req.query.to;

  hitWit.text(text).then(function(response){
    return nexmoSend(ourNumber, userNumber, response);
  })
  .catch(function(err){
    console.warn(err);
  });

  res.send(200,'success');
};