const express = require("express");
const bodyParser = require("body-parser");
const {
  createPaymentIntent,
  stripeWebhook,
} = require("../controllers/stripeController.js");
const Router = express.Router();

Router.post("/create-payment-intent", createPaymentIntent);

// Use `bodyParser.raw` for the webhook endpoint
Router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = Router;
