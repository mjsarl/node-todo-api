const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.findOneAndRemove({_id:'596e4d49e4d2026188aa8a64'}).then((done)=>{
    console.log(todo);
});
