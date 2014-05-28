var search = require('./search');

module.exports = function(req, res){
  console.log(req.query.text);
  var text = req.query.text;
  var userNumber = req.query.msisdn;
  var ourNumber = req.query.to;

  res.send(200,'success');
};