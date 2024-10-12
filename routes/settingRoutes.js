const express = require('express')
const {getFlatRate , updateFlatRate}=require('../controllers/settingsController.js')

const Router=express.Router()

Router.get('/getKey',getFlatRate)
Router.patch('/updateKey/:flatRateId',updateFlatRate)


module.exports=Router