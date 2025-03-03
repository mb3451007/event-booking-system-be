require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET;
const Booking = require("../model/bookingModel.js");
const BookingItem = require("../model/bookingItemsModel.js");
const axios = require("axios");

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, userId, packageId, packageName, userInfo, noOfPersons, totalPrice, fromDate, toDate, subItems } = req.body;
    console.log('amount', amount)
    // console.log('packageid', packageId)
    // console.log('userInfo', userInfo)
    // console.log('noOfPersons', noOfPersons)
    // console.log('totalPrice', totalPrice)
    // console.log('fromDate', fromDate)
    // console.log('toDate', toDate)
    // console.log('subItems', subItems)
    
    const booking = await saveBooking(userId, packageId, userInfo, noOfPersons, fromDate, toDate, totalPrice);
    console.log('Booking created: ', booking.id);
    
    
    if(booking){
      for (const subItem of subItems) {
        const subitem = await saveBookingItem(booking.id, subItem._id, subItem.name, subItem.quantity, subItem.price);
      }
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents for EUR/USD)
      currency,
      payment_method_types: ["card"],
      metadata: { 
        packageName,
        bookingId: booking.id.toString()
       },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } 
  catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ error: "Failed to create payment intent" });
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
    console.error("Error saving booking:", error);
    throw error;  // Handle or propagate the error
  }
}

async function saveBooking(userId, packageId, userInfo, noOfPersons, fromDate, toDate, totalPrice) {
  try {
    const name = `${userInfo.firstName} ${userInfo.lastName}`;
    const newBooking = new Booking({
      user: userId, // Assuming the schema has a 'user' field
      packageId: packageId,
      name: name,
      phone: userInfo.phone,
      email: userInfo.email,
      noOfPersons: noOfPersons,
      fromDate: new Date(fromDate).getTime(),
      toDate: new Date(toDate).getTime(),
      totalPrice: totalPrice,
      status: 'Pending',
      created_at: new Date()
    });

    const savedBooking = await newBooking.save();
    console.log("Booking saved successfully:", savedBooking); // Logs the saved booking

    // Return the saved booking object for further use
    return { id: savedBooking._id, savedBooking };
  } catch (error) {
    console.error("Error saving booking:", error);
    throw error;  // Handle or propagate the error
  }
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}



const stripeWebhook = async (req, res) => {
  console.log("Here");
  const sig = req.headers["stripe-signature"];
  console.log('sig', sig)
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret, 600);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;
      const packageName = paymentIntent.metadata.packageName;

      console.log('bookingId',bookingId)
      
      const webhookData = {
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method,
        created: paymentIntent.created,
      };
      try {
        const updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          {
            $set: {
              webhook: webhookData, // Store webhook data
              status: "Advance Paid", // Update status
            },
          },
          { new: true, runValidators: true } // Return the updated booking and validate changes
        );
        
        
        await axios.post(`http://localhost:3000/email/send`, {
          to: updatedBooking.email,
          subject: `Booking Confirmation - ${packageName}`,
          html: `
          <div style="font-family: Arial, sans-serif; color: #000000;">
          <p>Dear <strong>${updatedBooking.name}</strong>,</p>
          
          <p>Thank you for your booking! Your reservation has been confirmed. Here are the details:</p>
          
          <p>📅 <strong>Date & Time:</strong> From <span style="color: #333;">${formatTime(Number(updatedBooking.fromDate))}</span> to <span style="color: #333;">${formatTime(Number(updatedBooking.toDate))}</span></p>
          <p>📍 <strong>Package:</strong> <span style="color: #333;">${packageName}</span></p>
          <p>👥 <strong>Number of Persons:</strong> <span style="color: #333;">${updatedBooking.noOfPersons}</span></p>
          <p>💰 <strong>Total Price:</strong> <span style="color: #333;">${updatedBooking.totalPrice}</span></p>
          <p>🟢 <strong>Payment Status:</strong> Confirmed ✅</p>
          
          <p>We look forward to welcoming you. If you have any questions, feel free to reach out.</p>
          
          <p>Best regards,<br> <strong>Adlerpalast</strong></p>
          </div>
          `
        });
        
        
        console.log("UPDATD BOOKING", updatedBooking)
        console.log("formatted", formatTime(Number(updatedBooking.fromDate)))
        console.log("formatted", formatTime(1742912040000))
        console.log("Booking updated & email request sent.");
      } catch (error) {
        console.error("Error updating booking:", error);
      }
      break;
    case "payment_intent.failed":
      const failedPaymentIntent = event.data.object;
      console.log("PaymentIntent failed:", failedPaymentIntent);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = { createPaymentIntent, stripeWebhook };
