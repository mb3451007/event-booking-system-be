const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const items = require('./routes/itemsRoutes')
const subItems = require('./routes/subItemsRoutes')
// Create an HTTP server
const server = http.createServer(app)
const mongoose = require('mongoose');
const password="qwertyuiop#51"
mongoose.connect("mongodb+srv://zeeshanyousaf5151:UcDox0geRm75lz3t@cluster0.4bvnb.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(cors())
 app.use('/item',items )
 app.use('/subItem',subItems )
// Middleware
// app.use(bodyParser.json());
// Define the port to listen on
const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
