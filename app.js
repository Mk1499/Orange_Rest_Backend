// ======================================= External Liberaries ============================//

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const server = require("http").Server(app);
const bodyParser = require("body-parser");

// enable enviromental vars
require("dotenv").config();

// ======================================= MiddleWares ====================================//

 app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.send("Welcome in O Rest App Server ");
  console.log("user Connected :D ");
});

// ======================================= Routes ====================================//

const tableRouter = require("./routes/table.routes");
app.use("/tables", tableRouter);

const userRouter = require("./routes/user.routes");
app.use("/users", userRouter);


const bookRouter = require("./routes/booking.routes");
app.use("/book", bookRouter);

let port = process.env.PORT || 3005;
server.listen(port, process.env.IP, function() {
  console.log("DB Server has started on port no : " + port);
});

module.exports = app ; 
