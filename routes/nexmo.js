var Promise = require('bluebird');
var nexmo = require('nexmoapi').Nexmo;

//var ENV = require('../env.js');

var sender = new nexmo(process.env.NEXMO_KEY || ENV.NEXMO_KEY, process.env.NEXMO_SECRET || ENV.NEXMO_SECRET);

module.exports = Promise.promisify(function(a, b, c){
  c = (c.length < 150) ? c : c.slice(0,150) + '...';
  sender.send(a, b, c);
});




// module.exports = function(ourNumber, toNum, message) {
//   return send(ourNumber, toNum, message);
// });
