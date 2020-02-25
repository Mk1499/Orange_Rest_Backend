const app = require("../app");
const request = require("supertest")(app);
const should = require("should");

let lastBookingID;

describe("Book A Table", () => {
  it("Book a table without authenticated", done => {
    request
      .post("/book")
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Un Authenticated Request");
        done();
      });
  });

  let authClient = {};
  beforeEach(loginClient(authClient));
  it("Client need to book a table with old date", function(done) {
    request
      .post("/book")
      .send({
        tableId: 7,
        noOfPersons: 1,
        bookingDateStart: "2020-02-24 21:58:10",
        bookingDateEnd: "2020-02-25 12:10:10",
        creationDate: new Date()
      })
      .set("Authorization", "bearer " + authClient.token)
      .expect(400)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property(
          "error",
          "you must book a table in future date"
        );
        done();
      });
  });

  it("Client need to book a table with start date after end date", function(done) {
    request
      .post("/book")
      .send({
        tableId: 7,
        noOfPersons: 1,
        bookingDateStart: "2020-12-24 21:58:10",
        bookingDateEnd: "2020-02-25 12:10:10",
        creationDate: new Date()
      })
      .set("Authorization", "bearer " + authClient.token)
      .expect(400)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property(
          "error",
          "Start Booking Date Must be Before End Booking Date"
        );
        done();
      });
  });

  it("Client try to book a table number of persons more than its max capacity", function(done) {
    request
      .post("/book")
      .send({
        tableId: 7,
        noOfPersons: 10000000000000,
        bookingDateStart: "2020-3-24 21:58:10",
        bookingDateEnd: "2020-05-25 12:10:10",
        creationDate: new Date()
      })
      .set("Authorization", "bearer " + authClient.token)
      .expect(404)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property(
          "error",
          "You try to exceed table capacity"
        );
        done();
      });
  });

  it("Client try to Book a busy table", function(done) {
    request
      .post("/book")
      .send({
        tableId: 7,
        noOfPersons: 1,
        bookingDateStart: "2020-04-16 18:58:10",
        bookingDateEnd: "2020-04-23 10:10:10",
        creationDate: new Date()
      })
      .set("Authorization", "bearer " + authClient.token)
      .expect(500)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property(
          "error",
          "Sorry but table is not available is defined time "
        );
        done();
      });
  });

  it("Client try to Book a table in Right way", function(done) {
    request
      .post("/book")
      .send({
        tableId: 14,
        noOfPersons: 4,
        bookingDateStart: "2020-04-16 18:58:10",
        bookingDateEnd: "2020-04-23 10:10:10",
        creationDate: new Date()
      })
      .set("Authorization", "bearer " + authClient.token)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);

        done();
      });
  });
});

describe("View all Reservations", () => {
  it("View all Reservations with out authentication ", done => {
    request
      .get("/book")
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Un Authenticated Request");
        done();
      });
  });
  let authClient = {};
  before(loginClient(authClient));

  it("Client cannot show Reservations", function(done) {
    request
      .get("/book")
      .set("Authorization", "bearer " + authClient.token)
      .expect(401)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Un Authorized Request");
        done();
      });
  });

  let authAdmin = {};
  before(loginAdmin(authAdmin));
  it("Only Admin can view all Reservation", function(done) {
    request
      .get("/book")
      .set("Authorization", "bearer " + authAdmin.token)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        lastBookingID = res.body[res.body.length - 1].id;
        done();
      });
  });
});

describe("View Reservation for a specific Date (Filter Reservations by Date ", () => {
  it("View Reservation with out authentication ", done => {
    request
      .get("/book/2020-02-24")
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Un Authenticated Request");
        done();
      });
  });
  let authClient = {};
  before(loginClient(authClient));

  it("Client cannot show Reservation for a specfic date", function(done) {
    request
      .get("/book/2020-02-24")
      .set("Authorization", "bearer " + authClient.token)
      .expect(401)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Un Authorized Request");
        done();
      });
  });

  let authAdmin = {};
  before(loginAdmin(authAdmin));
  it("Only Admin can filter Reservations by Date", function(done) {
    request
      .get("/book/2020-02-24")
      .set("Authorization", "bearer " + authAdmin.token)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

describe("Cancel Reservation", () => {
  it("Cancel Reservation with out authentication ", done => {
    request
      .delete("/book/9")
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Un Authenticated Request");
        done();
      });
  });
  let authClient = {};
  before(loginClient(authClient));

  it("Client can't cancel Reservation", done => {
    request
      .delete("/book/9")
      .set("Authorization", "bearer " + authClient.token)
      .expect(401)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property("error", "Un Authorized Request");
        done();
      });
  });

  let authAdmin = {};
  before(loginAdmin(authAdmin));

  it("Only Admin Can Cancel Reservation", done => {
    request
      .delete("/book/" + lastBookingID)
      .set("Authorization", "bearer " + authAdmin.token)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
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
