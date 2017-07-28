const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 4
};

var token = jwt.sign(data, 'secretarmy');
console.log('Token using JWT: ', token);

var decoded = jwt.verify(token, 'secretarmy');
console.log('Verification: ', decoded);



var message = 'My name is Mark Sarl';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash -> ${hash}`);
