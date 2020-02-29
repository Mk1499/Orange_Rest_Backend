const books = require("../controllers/booking.controller");
const BookRouter = require("express").Router();
const adminAuth = require("../middlewares/adminAuth"); 
const clientAuth = require('../middlewares/clientAuth'); 
const commonAuth = require('../middlewares/commonAuth')

// Book a Table 
BookRouter.post("/",clientAuth, books.create);

BookRouter.get("/userBooks/:userId",commonAuth, books.findForClient)
// view all bookings
BookRouter.get("/",adminAuth, books.findAll);

BookRouter.get("/:date",adminAuth,books.findByDate); 

BookRouter.delete("/:bookId",adminAuth,books.delete);

module.exports = BookRouter;
