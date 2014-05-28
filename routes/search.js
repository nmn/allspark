var express = require('express');
var router = express.Router();

router.get('/search', function(req, res) {

  res.render('search',{title:"Search"})
});

router.post('/search', function(req, res) {

  res.send('respond with a resource');
});


module.exports = router;
