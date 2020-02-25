const books = require("../controllers/booking.controller");
const BookRouter = require("express").Router();
const adminAuth = require("../middlewares/adminAuth"); 
const clientAuth = require('../middlewares/clientAuth'); 

// Book a Table 
BookRouter.post("/",clientAuth, books.create);

// view all bookings
BookRouter.get("/",adminAuth, books.findAll);

BookRouter.get("/:date",adminAuth,books.findByDate); 

BookRouter.delete("/:bookId",adminAuth,books.delete);

module.exports = BookRouter;
