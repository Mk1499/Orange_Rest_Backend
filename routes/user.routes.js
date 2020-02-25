const users = require("../controllers/user.controller");
const UserRouter = require("express").Router();
const adminAuth = require("../middlewares/adminAuth");
const clientAuth = require("../middlewares/clientAuth");

UserRouter.post("/", users.create);

UserRouter.get("/", adminAuth, users.findAll);

UserRouter.post("/login", users.login);

UserRouter.get("/:userId", clientAuth, users.findOne);

module.exports = UserRouter;
