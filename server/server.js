var express = require ('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

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

app.post('/users', (req,res)=>{
  var user = new User({
    email: req.body.email
  });

  user.save().then((doc)=>{
    res.send(doc);
  }, (e)=>{
    res.status(400).send(e);
  });
});

module.exports = {app};



app.listen(3000, ()=>{
  console.log('Listening on port 3000');
});
