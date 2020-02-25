const tables = require("../controllers/table.controller.js");
const TableRouter = require("express").Router();
const adminAuth = require("../middlewares/adminAuth");
const clientAuth = require("../middlewares/clientAuth");

// Create a new Table
TableRouter.post("/", adminAuth, tables.create);

// Retrieve all Tables

TableRouter.get("/", adminAuth, tables.findAll);

TableRouter.get("/available", clientAuth, tables.getAvailable);

// Delete a Table with tableId
TableRouter.delete("/:tableId", adminAuth, tables.delete);

// TableRouter.delete("/deleteAll",adminAuth, tables.deleteAll);

module.exports = TableRouter;
