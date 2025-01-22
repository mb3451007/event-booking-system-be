const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const items = require("./routes/itemsRoutes.js");
const bookings = require("./routes/bookingsRoutes.js");
const peckage = require("./routes/packageRoutes.js");
const subItems = require("./routes/subItemsRoutes.js");
const auth = require("./routes/authRoutes.js");
const flatRate = require("./routes/settingRoutes.js");
const mongoose = require("mongoose");
const loginSchema = require("./model/authModel.js");
const flatRateSchema = require("./model/settingsModel.js");
const nodemailer = require("nodemailer");
const emailRoute = require("./routes/emailRoutes.js");
const stripeRoutes = require("./routes/stripeRoutes.js");
const bodyParser = require("body-parser");
const {
  createPaymentIntent,
  stripeWebhook,
} = require("./controllers/stripeController.js");

const server = http.createServer(app);
const password = "qwertyuiop#51";
const path = require("path");
const bcrypt = require("bcrypt");

const seedData = [
  { key: "flatRate1", value: 100 },
  { key: "Min no of persons", value: 200 },
  { key: "Max no of persons", value: 300 },
];

// mongoose
//   .connect("mongodb://localhost:27017/events", {})
mongoose.connect("mongodb+srv://zeeshanyousaf5151:qRUbxjVGV9okGi7S@cluster0.4bvnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
}).then(async () => {
  // console.log('Connected to MongoDB');
  // .then(async () => {
    console.log("Connected to MongoDB");

    const existingUser = await loginSchema.findOne({ username: "admin" });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("123", 10);
      loginSchema
        .create({ username: "admin", password: hashedPassword })
        .then((doc) => {
          console.log("Admin user created:", doc);
        })
        .catch((err) => {
          console.error("Error creating admin user:", err);
        });
    } else {
      console.log("Admin user already exists");
    }

    const existingFlatRates = await flatRateSchema.find({
      key: { $in: seedData.map((item) => item.key) },
    });
    if (existingFlatRates.length === 0) {
      flatRateSchema
        .insertMany(seedData)
        .then((docs) => {
          console.log("Flat rates created:", docs);
        })
        .catch((err) => {
          console.error("Error creating flat rates:", err);
        });
    } else {
      console.log("Flat rates already exist");
    }
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors());
app.use(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(express.json());

app.use("/item", items);
app.use("/booking", bookings);
app.use("/subItem", subItems);
app.use("/package", peckage);
app.use("/", auth);
app.use("/flatrate", flatRate);
app.use("/email", emailRoute);

// Stripe payment routes
app.use("/payment/create-payment-intent", createPaymentIntent);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
