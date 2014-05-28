
module.export = function(req,res){
  console.log(req.files);
  res.set('content-type', 'text/xml');
  res.render('vxmlresponse');
}