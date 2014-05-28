var express = require('express');
var router = express.Router();
var nexmo = require('nexmoapi').Nexmo;

var ENV = require('../env.js');

var sender = new nexmo(process.env.NEXMO_KEY || ENV.NEXMO_KEY, process.env.NEXMO_SECRET || ENV.NEXMO_SECRET);

router.post('/nexmo', function(req, res) {
  sender.send('12134657511','17349453112','message', function(err, res){
     if (err) {
          console.log(err);
     } else {
          console.dir(res);
     }
  });


});


module.exports = router;
