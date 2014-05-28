var Promise = require('bluebird');
var nexmo = require('nexmoapi').Nexmo;

//var ENV = require('../env.js');

var sender = new nexmo(process.env.NEXMO_KEY || ENV.NEXMO_KEY, process.env.NEXMO_SECRET || ENV.NEXMO_SECRET);

module.exports = Promise.promisify(sender.send.bind(sender));




// module.exports = function(ourNumber, toNum, message) {
//   return send(ourNumber, toNum, message);
// });
