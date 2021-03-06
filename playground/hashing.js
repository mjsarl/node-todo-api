const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'AnotherVillaFan';

bcrypt.genSalt(10, (err,salt)=>{
  bcrypt.hash(password, salt, (err, hash)=>{
    console.log('Password: ', password);
    console.log('Salt: ', salt);
    console.log('Hash: ', hash);
  });
});

var hashedPassword = '$2a$10$jJFAV56pbn916qJJ.LnD6egDIXmV4MpXpBc5ZODLbsRfq2LDCCoRi';

bcrypt.compare(password, hashedPassword, (err, result)=>{
  console.log('Result = ', result);
});

// var data = {
//   id: 4
// };
//
// var token = jwt.sign(data, process.env.JWT_SECRET);
// console.log('Token using JWT: ', token);
//
// var decoded = jwt.verify(token, process.env.JWT_SECRET);
// console.log('Verification: ', decoded);
//
//
//
// var message = 'My name is Mark Sarl';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash -> ${hash}`);
