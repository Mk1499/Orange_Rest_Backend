const Table = require("../models/table.model");

// Create and Save a new Table
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Table
  const table = new Table({
    label: req.body.label,
    max_persons: req.body.max_persons
  });

  // Save Table in the database
  Table.create(table, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Table."
      });
    else res.send(data);
  });
};

// Retrieve all Tables from the database.
exports.findAll = (req, res) => {
  Table.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

exports.getAvailable = (req, res) => {
  Table.getAvailable((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

// Delete a Table with the specified tableId in the request
exports.delete = (req, res) => {
  Table.remove(req.params.tableId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Table with id ${req.params.tableId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Table with id " + req.params.tableId
        });
      }
    } else res.send({ message: `Table was deleted successfully!` });
  });
};


exports.search = (req, res) => {
  Table.search(req.params.date , req.params.persons,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};