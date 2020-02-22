const users = require("../controllers/user.controller");
const UserRouter = require("express").Router();
const adminAuth = require("../middlewares/adminAuth"); 
const clientAuth = require('../middlewares/clientAuth'); 

// Create a new User
UserRouter.post("/", users.create);

// Retrieve all Users
UserRouter.get("/",adminAuth, users.findAll);

// Create a new User
UserRouter.delete("/",adminAuth, users.deleteAll);

// Login 
UserRouter.post("/login", users.login);

// Retrieve a single User with userId
UserRouter.get("/:userId",clientAuth, users.findOne);

// Update a User with userId
UserRouter.put("/:userId",adminAuth, users.update);

// Delete a User with userId
UserRouter.delete("/:userId",adminAuth, users.delete);

module.exports = UserRouter;
