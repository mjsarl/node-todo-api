// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


const DBConnStr = 'mongodb://1.20.30.78:27017/TodoApp';
MongoClient.connect(DBConnStr, (err, db) => {
  if (err){
  return console.log('Unable to connect to mongoDB Server');
  }
  console.log('Connected to MongoDB');

  // db.collection('Todos').find({
  //   _id: new ObjectID('595699b87dfd3a311a6797a6')
  // }).toArray().then((docs)=>{
  //   console.log('Todos List');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err)=>{
  //   console.log('Cannot retrieve docs', err);
  // });

  // db.collection('Todos').find().count().then((count)=>{
  //   console.log(`Todos List Count: ${count}`);
  // }, (err)=>{
  //   console.log('Cannot retrieve docs', err);
  // });

db.collection('Users').find({
  name: 'Mark Sarl'
}).toArray().then((docs)=>{
  console.log(JSON.stringify(docs,undefined,2));
}, (err)=>{
  console.log('Unable to find records', err);
});

  db.close();
});
