const bookingItem = require("../model/bookingItemsModel.js");
const booking  = require('../model/bookingsModel.js')


const getBookingItems = async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required" });
      }
  
      // Query subitems where bookingId matches the string
      const subItems = await bookingItem.find({bookingId: bookingId});
  
      if (subItems.length === 0) {
        return res.status(404).json({ message: "No bookingItems found for this booking" });
      }
  
      res.status(200).json({ message: "BookingItems found", subItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while fetching booking items" });
    }
  };
  
  module.exports = { getBookingItems };
  

  
  
  module.exports = {
    getBookingItems
  };
  