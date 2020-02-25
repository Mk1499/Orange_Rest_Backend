const app = require("../app");
const request = require("supertest")(app);
const should = require("should");

var lastTableID;

describe("Login", () => {
  it("login with not valid email", done => {
    request
      .post("/users/login")
      .send({
        email: "Khaled",
        password: "Khaled123"
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Please Enter a valid email");
        done();
      });
  });

  it("login with valid email but not Authenticated", done => {
    request
      .post("/users/login")
      .send({
        email: "Khaled@kknfd.com",
        password: "Khaled123"
      })
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property(
          "error",
          "Not found User with this email and password "
        );
        done();
      });
  });

  it("login with valid email with wrong password", done => {
    request
      .post("/users/login")
      .send({
        email: "Khaled@kknfd.com",
        password: "Khaled12"
      })
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property(
          "error",
          "Not found User with this email and password "
        );
        done();
      });
  });

  it("login with valid email and Password", done => {
    request
      .post("/users/login")
      .send({
        email: "Khaled@mail.com",
        password: "Khaled123"
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        done();
      });
  });
});

describe("Registeration", () => {
  it("try to add user without his info", done => {
    request
      .post("/users")
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Content can not be empty!");
        done();
      });
  });
  it("try to add user without his email", done => {
    request
      .post("/users")
      .send({
        "email":"",
        "user_name":"Messi", 
        "password":"messi123",
        "phone":"12345678"
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "email is required");
        done();
      });
  });
  it("try to add user without his username", done => {
    request
      .post("/users")
      .send({
        "email":"messi@mail.com",
        "user_name":"", 
        "password":"messi123",
        "phone":"12345678"
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "User name is required");
        done();
      });
  });
  it("try to add user without his password", done => {
    request
      .post("/users")
      .send({
        "email":"messi@mail.com",
        "user_name":"Messi", 
        "password":"",
        "phone":"12345678"
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Password is required");
        done();
      });
  });
  it("try to add user without his phone", done => {
    request
      .post("/users")
      .send({
        "email":"messi@mail.com",
        "user_name":"Messi", 
        "password":"messi123",
        "phone":""
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Phone number is required");
        done();
      });
  });
  it("try to add user with dublicated email", done => {
    request
      .post("/users")
      .send({
        "email":"messi@mail.com",
        "user_name":"Messi", 
        "password":"messi123",
        "phone":"1234567"
      })
      .expect(500)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Sorry But This email is already signed up before");
        done();
      });
  });

//   it("try to add user in Valid Way ", done => {
//     request
//       .post("/users")
//       .send({
//         "email":"messi2@mail.com",
//         "user_name":"Messi", 
//         "password":"messi123",
//         "phone":"1234567"
//       })
//       .expect(200)
//       .expect("Content-Type", /json/)
//       .end(function(err, res) {
//         if (err) return done(err);
//         res.body.should.be.instanceof(Object);
//         done();
//       });
//   });
});


function loginAdmin(auth) {
  return function(done) {
    request
      .post("/users/login")
      .send({
        email: "admin@mail.com",
        password: "admin123"
      })
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      auth.token = res.body.token;
      return done();
    }
  };
}

function loginClient(auth) {
  return function(done) {
    request
      .post("/users/login")
      .send({
        email: "Khaled@mail.com",
        password: "Khaled123"
      })
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      auth.token = res.body.token;
      return done();
    }
  };
}
