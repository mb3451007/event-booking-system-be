
const booking  = require('../model/bookingsModel.js')
const packages = require('../model/packageModel.js')
const { v4: uuidv4 } = require('uuid');
const mongoose=require("mongoose")


const addBooking = async (req, res) => {
  const { name,email,number, price, fromDate , toDate } = req.body;
console.log(req.body);
  if (!name  || !email || !number || !price || !fromDate || !toDate) {
    return res.status(400).json({ message: "Fill all required fields" });
  }

  try {
    const newItem = new booking({ name,email,number, price ,toDate , fromDate});
     await newItem.save();
    return res.status(201).json({ message: "booking added successfully" });
  } catch (error) {
    console.log("Error adding item:", error);
    return res.status(500).json({ message: "Error adding booking", error: error.message });
  }
};




// get Pagnated items
const getPaginatedBooking = async (req, res) => {
  const pageNumber = parseInt(req.params.pageNumber) || 1;
  const pageSize = 10;
  const skip = (pageNumber - 1) * pageSize

  try {
    const bookings = await booking.find().skip(skip).limit(pageSize)

    const totalBookings = await booking.countDocuments()
    totalPages = Math.ceil(totalBookings/pageSize)

    res.status(200).json({ message: "Paginated bookings", bookings, totalPages });
  } catch (error) {
    console.error("Error getting paginated bookings:", error);  // Log error details
    res.status(500).json({ message: "Error getting paginated bookings", error: error.message });
  }
};




// get All items

const getAllBookings = async (req, res) => {
  try {
    const bookings = await booking.find()

    res.status(200).json({ message: "All items", bookings });
  } catch (error) {
    res.status(500).json({ message: "Error getting all items", error });
  }
};





// Delete Items
const deleteBooking = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const deletedItem = await booking.findByIdAndDelete(itemId);

    if (deletedItem) {
      res.status(200).json({ message: "booking deleted successfully", deletedItem });
    } else {
      res.status(404).json({ message: "booking not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};


// Update Items
const updateBooking = async (req, res) => {
  const itemId = req.params.itemId;
  const { name,email,number, price,toDate , fromDate } = req.body;
console.log(packages)
  try {
    // Update the item in the Item collection
    const updatedItem = await booking.findByIdAndUpdate(
      itemId,
     
      { name, email ,number, price, toDate,fromDate },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }  

    return res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.log("Error updating item:", error);
    return res.status(500).json({ message: "Error updating item", error });
  }
};

module.exports = { addBooking, getPaginatedBooking, deleteBooking, updateBooking ,getAllBookings};
