const jwt = require("jsonwebtoken");
const Book = require("../models/booking.model");

// Create and Save a new Booking
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  return new Promise((resolve, reject) => {
    let userData;
    let token = req.headers.authorization.split(" ")[1];
    try {
      userData = jwt.verify(token, process.env.tokenSecret);
    } catch (err) {
      reject({ message: "Invalid Token" });
    }
    console.log("userDataeeeee : ", userData);

    resolve(userData.userData);
  })
    .then(userData => {
      const book = new Book({
        userId: userData.id,
        userEmail: userData.email,
        userPhone: userData.phone,
        tableId: req.body.tableId,
        noOfPersons: req.body.noOfPersons,
        bookingDateStart: req.body.bookingDateStart,
        bookingDateEnd: req.body.bookingDateEnd,
        creationDate: req.body.creationDate
      });

      // Save Book in the database
      Book.create(book, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              error:
                err.message ||
                "Con't book this table with that number of persons "
            });
          } else if (err.kind === "bad_request") {
            res.status(400).send({
              error:
                err.message || "Some error occurred while booking the Table."
            });
          } else {
            res.status(500).send({
              error:
                err.message || "Some error occurred while booking the Table."
            });
          }
        } else res.send(data);
      });
    })
    .catch(err => {
      console.log("EEE : ", err);
      res.status(500).send({
        message: err.message || "Some error occurred while booking the Table."
      });
    });
};

exports.findAll = (req, res) => {
  Book.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

exports.findByDate = (req, res) => {
  Book.findByDate(req.params.date, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found any Booking with date ${req.params.date}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Booking with date " + req.params.date
        });
      }
    } else res.send(data);
  });
};

exports.findForClient = (req, res) => {
  Book.findForClient(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found any Booking for user ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Booking for user " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  Book.remove(req.params.bookId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          error: `There is no Reservation with id ${req.params.bookId}`
        });
      } else {
        res.status(500).send({
          error: "Could not delete Reservation with id " + req.params.bookId
        });
      }
    } else res.send({ message: `Reservation was deleted successfully!` });
  });
};
