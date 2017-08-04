const {Todo} = require ('./../../models/todo');
const {User} = require ('./../../models/user');
const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'mark.sarl@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign ({_id:userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},
{
  _id: userTwoId,
  email: 'josh.sarl@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign ({_id:userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];


const todos = [{
  _id: new ObjectID(),
  text: 'First thing to do',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'Second thing to do',
  completed: true,
  completedAt: 13456,
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'Third thing to do',
  _creator: userTwoId
}];

const populateTodos = (done)=>{
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(()=> done());
};

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all ([userOne, userTwo]);
  }).then(()=>done());
};


module.exports = {todos, populateTodos, users, populateUsers};
