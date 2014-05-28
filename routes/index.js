var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(!req.session.passport.user){
    res.redirect('/login');
  }
  res.render('index', { title: 'Allspark' });
});

module.exports = router;
