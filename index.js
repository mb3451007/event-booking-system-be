const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const items = require('./routes/itemsRoutes')
const subItems = require('./routes/subItemsRoutes')
const auth =require('./routes/authRoutes')
// Create an HTTP server
const server = http.createServer(app)
const mongoose = require('mongoose');
const loginSchema = require('./model/authModel')
const password="qwertyuiop#51"

mongoose.connect("mongodb+srv://zeeshanyousaf5151:UcDox0geRm75lz3t@cluster0.4bvnb.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');

  // Insert the document
  loginSchema.create({ username: 'admin', password: '123' })
    .then(doc => {
      console.log('Document inserted:', doc);
    })
    .catch(err => {
      console.error('Error inserting document:', err);
    });
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
app.use(express.json());
app.use(cors())
 app.use('/item',items )
 app.use('/subItem',subItems )
 app.use('/',auth)
// Middleware
// app.use(bodyParser.json());
// Define the port to listen on
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
