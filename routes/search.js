var hitWit = require('./hitWit');

module.exports = function(req,res){
  var input = req.body.searchInput;

  hitWit.text(input).then(res.send.bind(res));

};