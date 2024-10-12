const express = require('express');
const Router =  express.Router();
const {addPackage, getPaginatedPackage,deletePackage,updatePackage,getAllPackage,getPackageById} = require('../controllers/packageController.js')


Router.post('/add-package', addPackage)
Router.get('/get-package/:pageNumber', getPaginatedPackage)
Router.get('/get-package', getAllPackage)
Router.get('/get-packageById/:packageId', getPackageById)
Router.delete('/delete-package/:packageId', deletePackage)
Router.patch('/update-package/:packageId', updatePackage)
module.exports = Router