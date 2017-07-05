var mongoose = require ('mongoose');

const DBConnStr = 'mongodb://1.20.30.78:27017/TodoApp';
mongoose.Promise = global.Promise;
mongoose.connect(DBConnStr);

module.exports = {mongoose};
