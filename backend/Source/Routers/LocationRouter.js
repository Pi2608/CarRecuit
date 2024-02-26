const express = require('express')
const locationController = require('../controllers/LocationController')

const locationRouters = express.Router()

locationRouters.get('/', locationController.getCarLocation)

module.exports=locationRouters

