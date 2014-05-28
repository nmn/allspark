var Promise = require('bluebird');
var request = require('request');
request = Promise.promisify(request);

var wolfram = require('./../actions/wolfram');

var funcs = {
  'text': function(text) {

    console.log("query", text);

    var query = encodeURIComponent(text);

    var options = {
      url:  'https://api.wit.ai/message?v=20140528&q='+query,
      headers: {
        'Authorization': 'Bearer TE4IZYGQG7ZR2CBQE4RYZGKDNYYSIVDA'
      }
    }

    return request(options)
    .spread(function(response, body){
      var data = JSON.parse(body);
      //console.log('body', data.outcome);
      return data.outcome;
    })
    .then(function(outcome){
      console.log("outcome", outcome);
      switch(outcome.intent){
        case 'wikipedia':
        case 'wolfram':
          console.log((outcome.entities.wikipedia_search_query) ? outcome.entities.wikipedia_search_query.body : outcome.entities.wolfram_search_query.body);
          return (outcome.entities.wikipedia_search_query) ? wolfram(outcome.entities.wikipedia_search_query.body) : wolfram(outcome.entities.wolfram_search_query.body);
        default: return 'I don\'t understand ' + text;
      }
    })


  },

  'voice': function(audioFile){

  }

};

module.exports = funcs;


// funcs.text('What is a snail?');