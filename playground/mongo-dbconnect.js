// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


const DBConnStr = 'mongodb://1.20.30.78:27017/TodoApp';
MongoClient.connect(DBConnStr, (err, db) => {
  if (err){
  return console.log('Unable to connect to mongoDB Server');
  }
  console.log('Connected to MongoDB');

  db.collection('Todos').insertOne({
    text: 'Walk the dog',
    completed: false
  }, (err, result)=>{
    if(err){
      return console.log('Unable to insert', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });

//   db.collection('Users').insertOne({
//     name: 'Mark Sarl',
//     age: 47,
//     location: 'High Wycombe'
//   }, (err, result)=>{
//     if(err){
//       return console.log('Unable to insert', err);
//     }
//     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
//   });
//
  db.close();
});
