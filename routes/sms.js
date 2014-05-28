module.exports = function(req, res){
  console.log(req.query.text);
  res.send(200,'success');
};