const express = require('express')
const {login,resetPassword }=require('../controllers/authController.js')

const Router=express.Router()

Router.post('/login',login)
Router.post('/resetPassword/:userId',resetPassword)


module.exports=Router