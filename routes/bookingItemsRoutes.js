const express = require("express");
const Router = express.Router();
const {
    getBookingItems
} = require("../controllers/bookingItemsController.js");

Router.get("/get-bookingItem/:bookingId", getBookingItems);
module.exports = Router;
