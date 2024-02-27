const express = require('express')
const locationController = require('../controllers/LocationController')

const locationRouters = express.Router()

locationRouters.get('/', locationController.getCarLocation)
locationRouters.post('/add', locationController.addCarRentLocation)

module.exports=locationRouters

