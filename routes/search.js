var express = require('express');
var router = express.Router();
var request = require('request');


router.post('/search', function(req, res) {

  console.log("query", req.body);

  var query = encodeURIComponent(req.body.searchInput);

  var options = {
    url:  'https://api.wit.ai/message?v=20140528&q='+query,
    headers: {
      'Authorization': 'Bearer TE4IZYGQG7ZR2CBQE4RYZGKDNYYSIVDA'
    }
  }

  request(options,function(err, res, body){
    if(!err && res.statusCode == 200){
      var data = JSON.parse(body);
      if(data.outcome.intent === 'wikipedia'){
        wikipedia(data);
      }else if(data.outcome.intent === 'tweet'){
        tweet(data);
      }else if(data.outcome.intent === 'wolfram'){
        wolfram(data);
      }
    }
    //console.log(data);
  })

  res.send('got data');

});

router.get('/search', function(req, res){
  console.log(req.query.text);
  res.send(200,'success');
});

function wikipedia(data){
  console.log("wiki", data);
}

function tweet(data){
  console.log("tweet", data);
}

function wolfram(data){
  console.log("wolfram", data);
}

module.exports = router;
