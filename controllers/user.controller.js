const User = require("../models/user.model");
const bcrypt = require('bcrypt'); 

// Create and Save a new User
exports.create = (req, res) => {
   // Validate request
   if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    user_name: req.body.user_name,
    type:  'client',
    email: req.body.email, 
    phone: req.body.phone, 
    password: req.body.password
  });

  bcrypt.hash(user.password,10,(err,hashedPW)=>{
    user.password = hashedPW ; 

    // Save User in the database
    
    User.create(user, (err, data) => {
      if (err)
      res.status(500).send({
        message:
        err.message || "Some error occurred while creating the User."
      });
      else res.send(data);
    });
  })
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.getAll((err,data)=>{
    if (err)
    res.status(500).send({
      message:
        err.message || "Some error occurred while Get All Users."
    });
  else res.send(data);
  })
};

// Find a single User with a userId
exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Customer with id " + req.params.userId
          });
        }
      } else res.send(data);
    });
  };

  // Find a single User with a userId
exports.login = (req, res) => {
    let user = {
        email: req.body.email,
        password: req.body.password
    }
    User.login(user, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with this email and password `
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Customer "
          });
        }
      } else res.send(data);
    });
  };

// Update a User identified by the userId in the request
exports.update = (req, res) => {
  
};

// Delete a User with the specified userId in the request
exports.delete = (req, res) => {
  
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  
};