var request = require('request');

module.exports = {
  'text': function(text) {

    console.log("query", text);

    var query = encodeURIComponent(text);

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

  },

  'voice': function(audioFile){

  }

}