// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


const DBConnStr = 'mongodb://1.20.30.78:27017/TodoApp';
MongoClient.connect(DBConnStr, (err, db) => {
  if (err){
  return console.log('Unable to connect to mongoDB Server');
  }
  console.log('Connected to MongoDB');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('59573a9f650a15b150d85269')
  // },{
  //   $set: {
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((res)=>{
  //   console.log(res);
  // });

db.collection('Users').findOneAndUpdate({
  _id: new ObjectID('59569acc0405bf32257a5c9f')
},{
  $set: {
    name: 'Lucy Locket'
  },
  $inc: {
    age: 2
  }
},{
  returnOriginal: false
}).then((res)=>{
  console.log(JSON.stringify(res,undefined,2));
});

  db.close();
});
