require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.ENDPOINT_SECRET;
const Booking = require("../model/bookingModel.js");
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, userId } = req.body;
    console.log('amount', amount)

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in the smallest currency unit (e.g., cents for EUR/USD)
      currency,
      payment_method_types: ["card"],
      metadata: { userId },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

const stripeWebhook = async (req, res) => {
  console.log("Here");
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId; // Retrieve userId from metadata
      const webhookData = {
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentMethod: paymentIntent.payment_method,
        created: paymentIntent.created,
      };
      try {
        // Save booking data to MongoDB
        const newBooking = new Booking({
          user: userId, // Assuming the schema has a 'user' field
          webhook: webhookData,
        });

        await newBooking.save();
        console.log("Booking saved successfully.");
      } catch (error) {
        console.error("Error saving booking:", error);
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
