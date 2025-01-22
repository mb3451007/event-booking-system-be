const express = require('express');
const Router =  express.Router();
const {addBooking, getPaginatedBooking,getAllBookings,deleteBooking,updateBooking} = require('../controllers/booking-controller.js')


Router.post('/add-booking', addBooking)
Router.get('/get-bookings/:pageNumber', getPaginatedBooking)
Router.get('/get-bookings', getAllBookings)
Router.delete('/delete-booking/:itemId', deleteBooking)
Router.patch('/update-booking/:itemId', updateBooking)
module.exports = Router