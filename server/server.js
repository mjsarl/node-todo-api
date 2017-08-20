require ('./config/config');

const _ = require ('lodash');
const express = require ('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');


var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
  var todo = new Todo ({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc)=>{
      res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res)=>{
  Todo.find({
    _creator: req.user._id
  }).then((todos)=>{
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});


app.get('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id;

if (!ObjectID.isValid(id)){
  return res.status(404).send();
}

Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
  if(!todo){
    return res.status(404).send();
  }
  res.send({todo});
}).catch((e)=>{
  res.status(400).send();
});

});

app.delete('/todos/:id', authenticate, async (req,res)=>{
  try {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      throw new Error;
    }
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if(!todo){
      throw new Error;
    }
    res.send({todo});
  } catch (e) {
    return res.status(404).send();
  }
  // var id = req.params.id;
  // if(!ObjectID.isValid(id)){
  //   return res.status(404).send();
  // }
  //
  // Todo.findOneAndRemove({
  //   _id: id,
  //   _creator: req.user._id
  // }).then((todo)=>{
  //     if(!todo){
  //       return res.status(404).send();
  //     }
  //     res.send({todo});
  // }).catch((e)=>{
  //   res.status(400).send();
  // });
});

app.patch('/todos/:id', authenticate, (req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    var body = _.pick(req.body, ['text', 'completed']);

    if (_.isBoolean(body.completed) && body.completed){
      //completed is true
      body.completedAt = new Date().getTime();

    } else {
      body.completed = false;
      body.completedAt = null;

    }

    Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {$set:body}, {new: true}).then((todo)=>{
      if (!todo){
        return res.status(404).send();
      }
      return res.status(200).send({todo});
    }).catch((e)=> {
      res.status(400).send();
    });
});

app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User (body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e.errmsg || e);
  }
  // var body = _.pick(req.body, ['email', 'password']);
  // var user = new User (body);
  // user.save().then(()=>{
  //   // res.status(200).send(doc);
  //   return user.generateAuthToken();
  // }).then((token)=>{
  //   res.header('x-auth', token).send(user);
  // }).catch((e)=>{
  //   res.status(400).send(e.errmsg || e);
  // });
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);

});

app.post('/users/login', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);
    var email = body.email;
    var password = body.password;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
  // User.findByCredentials(email, password).then((user)=>{
  //   // console.log('USER returned to server.js = ', user.email);
  //   return user.generateAuthToken().then((token)=>{
  //     res.header('x-auth', token).send(user);
  //   });
  // }).catch((e)=>{
  //   res.status(400).send(e);
  // });
});

app.delete('/users/me/token', authenticate, async (req,res)=>{
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});


module.exports = {app};



app.listen(port, ()=>{
  console.log(`Started on ${port}`);
});
