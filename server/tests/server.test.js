const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require ('./../models/todo');
const {User} = require ('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// Clear database
beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', ()=>{
  it('Should create a new todo', (done)=>{
    var text = 'Test for todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end ((err,res)=>{
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e)=> done(e));

    });
  });
  it('should not create a todo with invalid data', (done)=>{
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>{
      if(err){
        return done(err);
      }
    Todo.find().then((todos)=>{
      expect(todos.length).toBe(3);
      done();
    }).catch((e)=> done(e));
    });
  });

});

describe('GET /todos', ()=>{
  it('Should get all todos', (done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
        expect(res.body.todos.length).toBe(3);
    })
    //id = res.body.todos[0]._id;
    .end(done);
  });
  it('Should get a todo with specified ID', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('Should return 404 if ID is not found', (done)=>{
    //var testID = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should return 404 for non ObjectIDs', (done)=>{
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos:id', ()=>{
  it('Should remove a todo by specified ID', (done)=>{
    var HexID = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${HexID}`)
    .expect (200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(HexID);
    })
    .end ((err,res)=>{
      if(err){
        return done(err);
      }

      Todo.findById(HexID).then((todo)=>{
          expect(todo).toNotExist();
          done();
      }).catch((e)=>done(e));

    });
  });

  it('Should return 404 if todo not found', (done)=>{
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should return 404 if Object ID is not valid', (done)=>{
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos:id', ()=>{
  it('Should update text and change completed from false to true', (done)=>{
    var HexID = todos[0]._id.toHexString();
    var newText = 'Test Text Content';
    request(app)
    .patch(`/todos/${HexID}`)
    .send({text: newText, completed:true})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(HexID);
      expect(res.body.todo.text).toBe(newText);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });

  it('Should set completedAt to null when you change completed from True to false', (done)=>{
    var HexID = todos[1]._id.toHexString();
    var newText2 = 'Second Test Text Content';
    request(app)
    .patch(`/todos/${HexID}`)
    .send({text: newText2, completed:false})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(HexID);
      expect(res.body.todo.text).toBe(newText2);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });

});

describe('GET /users/me', ()=>{
  it('Should return user if authenticated', (done)=>{
    request(app)
    .get(`/users/me`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('Should return a 401 if not authenticated', (done)=>{
    request(app)
    .get(`/users/me`)
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', ()=>{
  it('Should create a user', (done)=>{
    var email = 'myexample@example.com';
    var password = 'validPassword';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err)=>{
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      });
    });
  });

  it('Should return a validation error if request invalid', (done)=>{
    request(app)
    .post('/users')
    .send({email:'invalidEmail', password: '123'})
    .expect(400)
    .end(done);
  });

  it('Should return an error if email already in use', (done)=>{
    var email = users[0].email;
    var password = 'validPassword';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .end(done);
  });

});
