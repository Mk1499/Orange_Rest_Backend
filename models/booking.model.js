const sql = require("./db.js");

// constructor
const Booking = function(booking) {
  this.userId = booking.userId;
  this.userEmail = booking.userEmail;
  this.userPhone = booking.userPhone;
  this.tableId = booking.tableId;
  this.noOfPersons = booking.noOfPersons;
  this.bookingDateStart = booking.bookingDateStart;
  this.bookingDateEnd = booking.bookingDateEnd;
  this.creationDate = new Date();
};

Booking.create = (newBooking, result) => {
  console.log("New Booking : ", newBooking);

  return new Promise((resolve, reject) => {
    let bookingDateStart = new Date(newBooking.bookingDateStart);
    let bookingDateEnd = new Date(newBooking.bookingDateEnd);
    let dateOfNow = new Date();

    if (!(bookingDateStart > dateOfNow)) {
      reject({
        message: "you must book a table in future date"
      });
    } else if (bookingDateEnd < bookingDateStart) {
      reject({
        message: "Start Booking Date Must be Before End Booking Date"
      });
    } else {
      let tableCapacityQuery = `SELECT * FROM Tables WHERE id = ${newBooking.tableId} and max_persons >= ${newBooking.noOfPersons}`;
      let tableAvailableQuery = `SELECT * FROM Reservations WHERE tableId = ${newBooking.tableId} and (DATE('${newBooking.bookingDateStart}') BETWEEN DATE(bookingDateStart) AND DATE (bookingDateEnd) or DATE('${newBooking.bookingDateEnd}') BETWEEN DATE(bookingDateStart) AND DATE (bookingDateEnd))`;

      sql.query(tableCapacityQuery, (err, res) => {
        if (err) {
          reject(err);
        } else if (res.length === 0) {
          reject({
            kind: "not_found",
            message: "You try to exceed table capacity"
          });
        } else if (res.length) {
          sql.query(tableAvailableQuery, (err, res) => {
            if (err) {
              reject(err);
            } else if (res.length !== 0) {
              reject({
                kind: "Booking Overlabbing",
                message: "Sorry but table is not available is defined time "
              });
            } else {
              resolve();
            }
          });
        }
      });
    }
  })
    .then(() => {
      sql.beginTransaction(error => {
        if (error) throw error;

        sql.query(
          `UPDATE Tables SET status = 'busy' WHERE id = ${newBooking.tableId}`,
          (err, res) => {
            if (err) {
              sql.rollback();
            }
          }
        );

        sql.query("INSERT INTO Reservations SET ?", newBooking, (err, res) => {
          if (err) {
            sql.rollback();
            console.log("error: ", err);
            result(err, null);
            return;
          }

          console.log("created booking: ", {
            id: res.insertId,
            ...newBooking
          });
          result(null, { id: res.insertId, ...newBooking });
        });

        sql.commit(err => {
          if (err) {
            console.log("commit error : ", err);
            sql.rollback();
          }
        });
      });
    })
    .catch(err => {
      console.log("Catch gerr ", err);
      result(err, null);
    });
};

Booking.getAll = result => {
  let q = "SELECT * FROM Reservations";
  sql.query(q, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("bookings: ", res);
    result(null, res);
  });
};

Booking.findByDate = (date, result) => {
  let q = `SELECT * FROM Reservations WHERE DATE(bookingDateStart) = '${date}' `;
  console.log("Q : ", q);

  sql.query(q, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("bookings: ", res);
    result(null, res);
  });
};

module.exports = Booking;
