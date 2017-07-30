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

app.post('/todos', (req, res)=>{
  var todo = new Todo ({
    text: req.body.text
  });

  todo.save().then((doc)=>{
      res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});


app.get('/todos/:id',(req, res)=>{
  var id = req.params.id;

if (!ObjectID.isValid(id)){
  return res.status(404).send();
}

Todo.findById(id).then((todo)=>{
  if(!todo){
    return res.status(404).send();
  }
  res.send({todo});
}).catch((e)=>{
  res.status(400).send();
});

});

app.delete('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo)=>{
      if(!todo){
        return res.status(404).send();
      }
      res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res)=>{
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

    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo)=>{
      if (!todo){
        return res.status(404).send();
      }
      return res.status(200).send({todo});
    }).catch((e)=> {
      res.status(400).send();
    });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User (body);
  user.save().then(()=>{
    // res.status(200).send(doc);
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(user);
  }).catch((e)=>{
    res.status(400).send(e.errmsg || e);
  });
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);

});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var email = body.email;
  var password = body.password;

  User.findByCredentials(email, password).then((user)=>{
    // console.log('USER returned to server.js = ', user.email);
    res.send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});



module.exports = {app};



app.listen(port, ()=>{
  console.log(`Started on ${port}`);
});
