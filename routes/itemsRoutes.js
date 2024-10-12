const express = require('express');
const Router =  express.Router();
const {addItem, getPaginatedItem,deleteItem,updateitem,getAllItems} = require('../controllers/item-controller.js')


Router.post('/add-item', addItem)
Router.get('/get-items/:pageNumber', getPaginatedItem)
Router.get('/get-items', getAllItems)
Router.delete('/delete-item/:itemId', deleteItem)
Router.patch('/update-item/:itemId', updateitem)
module.exports = Router