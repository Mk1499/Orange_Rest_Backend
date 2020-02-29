const sql = require("./db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// constructor
const User = function(user) {
  this.user_name = user.user_name;
  this.type = user.type;
  this.email = user.email;
  this.phone = user.phone;
  this.password = user.password;
};

// Create user
User.create = (userData, result) => {
  let q = `SELECT id from Users WHERE email = '${userData.email}'`;
  

  sql.query(q, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    } else if (res.length > 0) {
      result(
        {
          message: "Sorry But This email is already signed up before"
        },
        null
      );
      return;
    } else if (res.length === 0) {
      // let token = jwt.sign({ userData }, process.env.tokenSecret);

      // userData.token = token;
      sql.query("INSERT INTO Users SET ?", userData, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("created user: ", { id: res.insertId, ...userData });
        let token = jwt.sign({ userData }, process.env.tokenSecret);

          userData.token = token;
        result(null, { id: res.insertId, ...userData });
      });
    }
  });
};

// Find User Profile
User.findById = (userId, result) => {
  sql.query(`SELECT * FROM Users WHERE id = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM Users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("tables: ", res);
    result(null, res);
  });
};
// Login User
User.login = (user, result) => {
  console.log("User Data : ", user);
  

  let query = `SELECT * FROM Users WHERE email = '${user.email}'`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error : ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("User : ", res[0].password);
      let userData = res[0];
      bcrypt.compare(user.password, userData.password, (err, match) => {
        if (err) {
          console.log("error : ", err);
          result(err, null);
          return;
        } else if (match) {
          console.log("found user : ", userData);
          let token = jwt.sign({ userData }, process.env.tokenSecret);

          userData.token = token;
          result(null, userData);
          return;
        } else {
          result({ kind: "not_found" }, null);
        }
      });
    } else {
      result({ kind: "not_found" }, null);
    }
  });

  //  query = `SELECT * FROM Users WHERE email = '${user.email}' and password = '${user.password}'`;
  //   console.log("Q : ", query);

  //   sql.query(query, (err, res) => {
  //     if (err) {
  //       console.log("error : ", err);
  //       result(err, null);
  //       return;
  //     }

  //   if (res.length) {

  //   }

  //   // not found User with given email and password
  //   result({ kind: "not_found" }, null);
  // });
};

// Remove a specific User
User.remove = (id, result) => {
  sql.query("DELETE FROM Tables WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Table with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

module.exports = User;
