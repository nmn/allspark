var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
  // res.send('respond with a resource');

  res.render('login', { title: 'Log In' });

});


module.exports = router;
