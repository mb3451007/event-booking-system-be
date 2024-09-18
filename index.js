const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const items = require('./routes/itemsRoutes');
const peckage = require('./routes/packageRoutes');
const subItems = require('./routes/subItemsRoutes');
const auth = require('./routes/authRoutes');
const flatRate = require('./routes/settingRoutes');
const mongoose = require('mongoose');
const loginSchema = require('./model/authModel');
const flatRateSchema = require('./model/settingsModel');
const nodemailer = require('nodemailer');
const emailRoute = require('./routes/emailRoutes');
const server = http.createServer(app);
const password = "qwertyuiop#51";

const seedData = [
  { key: 'flatRate1', value: 100 },
  { key: 'Min no of persons', value: 200 },
  { key: 'Max no of persons', value: 300 },
];

mongoose.connect("mongodb+srv://zeeshanyousaf5151:UcDox0geRm75lz3t@cluster0.4bvnb.mongodb.net/", {
}).then(async () => {
  console.log('Connected to MongoDB');

 
  const existingUser = await loginSchema.findOne({ username: 'admin' });
  if (!existingUser) {
   
    loginSchema.create({ username: 'admin', password: '123' })
      .then(doc => {
        console.log('Admin user created:', doc);
      })
      .catch(err => {
        console.error('Error creating admin user:', err);
      });
  } else {
    console.log('Admin user already exists');
  }


  const existingFlatRates = await flatRateSchema.find({ key: { $in: seedData.map(item => item.key) } });
  if (existingFlatRates.length === 0) {
 
    flatRateSchema.insertMany(seedData)
      .then(docs => {
        console.log('Flat rates created:', docs);
      })
      .catch(err => {
        console.error('Error creating flat rates:', err);
      });
  } else {
    console.log('Flat rates already exist');
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(express.json());
app.use(cors());
app.use('/item', items);
app.use('/subItem', subItems);
app.use('/package', peckage);
app.use('/', auth);
app.use('/flatrate', flatRate);
app.use('/email', emailRoute);


const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
