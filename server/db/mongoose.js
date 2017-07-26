var mongoose = require ('mongoose');

// const DBConnStr = 'mongodb://1.20.30.78:27017/TodoApp';
const DBConnStr = 'mongodb://localhost:27017/TodoApp';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || DBConnStr);

module.exports = {mongoose};
