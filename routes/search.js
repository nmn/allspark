var hitWit = require('./hitWit');

module.exports = function(req,res){
  var input = req.body.searchInput;

  hitWit.text(input, undefined, req.session).then(function(result){
      res.send(result);
  })
  .catch(function(err){
    res.send(500, err);
  });

};