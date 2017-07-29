const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'password123';

bcrypt.genSalt(10, (err,salt)=>{
  bcrypt.hash(password, salt, (err, hash)=>{
    console.log('Password: ', password);
    console.log('Salt: ', salt);
    console.log('Hash: ', hash);
  });
});

var hashedPassword = '$2a$10$jpfczEIuuT/jejNtNqH8Gey2cuymdTEEc4vCIsEklOsxlCwMOupo2';

bcrypt.compare(password, hashedPassword, (err, result)=>{
  console.log('Result = ', result);
});

// var data = {
//   id: 4
// };
//
// var token = jwt.sign(data, 'secretarmy');
// console.log('Token using JWT: ', token);
//
// var decoded = jwt.verify(token, 'secretarmy');
// console.log('Verification: ', decoded);
//
//
//
// var message = 'My name is Mark Sarl';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash -> ${hash}`);
