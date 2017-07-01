// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


const DBConnStr = 'mongodb://1.20.30.78:27017/TodoApp';
MongoClient.connect(DBConnStr, (err, db) => {
  if (err){
  return console.log('Unable to connect to mongoDB Server');
  }
  console.log('Connected to MongoDB');

  //Delete Many
  // db.collection('Todos').deleteMany({
  //   text: 'Get Breakfast'
  // }).then((result)=>{
  //   console.log(result);
  // });

//Delete One
// db.collection('Todos').deleteOne({
//   text: 'Get Breakfast'
// }).then((results)=>{
//   console.log(results);
// });


//Find one and delete
// db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
//   console.log(result);
// });

// db.collection('Users').deleteMany({name:'Mark Sarl'}).then((res)=>{
//   console.log(res);
// });

db.collection('Users').findOneAndDelete(
  {_id: new ObjectID('595726a91d94ad15828a86ee')}).then((res)=>{
  console.log(res);
});

  db.close();
});
