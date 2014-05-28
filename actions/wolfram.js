var env = require('./../env.js');

var Promise = require('bluebird');
var request = require('request');
var parseString = require('xml2js').parseString;
parseString = Promise.promisify(parseString);
request = Promise.promisify(request);


var searchWolfram = function (queryString) { 
  return request('http://api.wolframalpha.com/v2/query?input='+ encodeURIComponent(queryString) +'&appid=' + env.WOLFRAM_ALPHA_TOKEN)
    .then(function (response, body) {
      //console.log('response', response[0].body);
      return parseString(response[0].body);
    })
    .then(function(json){
      return json.queryresult.pod;
    })
    .filter(function(pod){
      return pod.$.title === 'Result' ||
             pod.$.title === 'Current result' ||
             pod.$.title === 'Decimal approximation' ||
             pod.$.title === 'Exact result';
    })
    .map(function(pod){
      return [pod.$.title, pod.subpod[0].plaintext[0]];
    })
    .then(function(pods){
      var result = pods[0][1];
      if(pods.length > 1){
        pods.forEach(function(pod){
          if(pod[0] === 'Decimal approximation'){
            result += ' or ' + pod[1];
          }
        });
      }
      return result;
    })
    .catch(console.log.bind(console, 'error: '));
};

module.exports = searchWolfram;

// test code
//searchWolfram('what is a third of one hundred?').then(console.log.bind(console));

