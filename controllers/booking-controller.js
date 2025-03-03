
const booking  = require('../model/bookingsModel.js')
const packages = require('../model/packageModel.js')
const { v4: uuidv4 } = require('uuid');
const mongoose=require("mongoose");
const Booking = require('../model/bookingModel.js');
const BookingItem = require('../model/bookingItemsModel.js');


const addBooking = async (req, res) => {
  const { name,email,phone, fromDate , toDate, packageId, totalPrice, userId, noOfPersons, status, subItems } = req.body;
  
  try {
    const booking=await saveBooking(userId, packageId, name, email, phone, noOfPersons, fromDate, toDate, totalPrice, status);
    
    if(booking){
      for (const subItem of subItems) {
        const subitem = await saveBookingItem(booking.id, subItem._id, subItem.name, subItem.quantity, subItem.price);
      }
    }

    return res.status(201).json({ message: "booking added successfully" });
  } catch (error) {
    console.log("Error adding item:", error);
    return res.status(500).json({ message: "Error adding booking", error: error.message });
  }
};


async function saveBookingItem(bookingId, itemId, itemName, quantity, price) {
  try {
    // Save booking data to MongoDB
    const newBooking = new BookingItem({
      bookingId: bookingId,
      itemId: itemId,
      itemName: itemName,
      quantity: quantity,
      price: price
    });

    const savedBooking = await newBooking.save();
    console.log("subitem saved successfully:", savedBooking);

    return { id: savedBooking._id };
  } catch (error) {
    console.error("Error saving item:", error);
    throw error;  // Handle or propagate the error
  }
}

async function saveBooking(userId, packageId, name, email, phone, noOfPersons, fromDate, toDate, totalPrice, status) {
  try {
    console.log('fromDae', new Date(fromDate).getTime())
    console.log('toDae', new Date(toDate).getTime())
    const newBooking = new Booking({
      user: userId, // Assuming the schema has a 'user' field
      packageId: packageId,
      name: name,
      phone: phone,
      email: email,
      noOfPersons: noOfPersons,
      fromDate: new Date(fromDate).getTime(),
      toDate: new Date(toDate).getTime(),
      totalPrice: totalPrice,
      status: status,
      created_at: new Date(),
    });

    console.log('booking to be saved', newBooking)

    const savedBooking = await newBooking.save();
    console.log("Booking saved successfully:", savedBooking); // Logs the saved booking

    // Return the saved booking object for further use
    return { id: savedBooking._id, savedBooking };
  } catch (error) {
    console.error("Error saving booking:", error);
    throw error;  // Handle or propagate the error
  }
}




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

const updateBooking = async (req, res) => { console.log('here')
  const itemId = req.params.itemId;
  const { name,email,phone, fromDate , toDate, packageId, totalPrice, userId, noOfPersons, status, subItems } = req.body;
  console.log('name', name)
  console.log('email', email)
  console.log('phone', phone)
  console.log('fromDate', fromDate)
  console.log('toDate', toDate)
  console.log('ackageId',packageId)
  console.log('totalPrice', totalPrice)
  console.log('userId', userId)
  console.log('noOfPersons', noOfPersons)
  console.log('status', status)

  console.log("Received fromDate:", fromDate, "-> Parsed:", new Date(fromDate));
console.log("Received toDate:", toDate, "-> Parsed:", new Date(toDate));

  try {

    const updatedItem = await Booking.findByIdAndUpdate(
      itemId,
      {
        user: userId,
        packageId: packageId,
        name: name,
        phone: phone,
        email: email,
        noOfPersons: noOfPersons,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
        totalPrice: totalPrice,
        status: status,
        updated_at: new Date() 
      },
      { new: true } // This option returns the updated document
    );

    subItems.forEach(async (item) => {
      try {
        // Assuming you have a model named 'SubItemModel' to store individual items
        await BookingItem.updateOne(
          { _id: item._id }, // assuming each item has a unique identifier
          { $set: item }, // update with the new data
        );
      } catch (error) {
        console.error('Error updating item:', error);
      }
    });

    console.log('updatedSubitem', subItems)

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
