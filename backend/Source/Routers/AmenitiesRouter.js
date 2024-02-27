const express = require('express')
const amenitiesController = require('../controllers/AmenitiesController')

const amenitiesRouter = express.Router()

amenitiesRouter.get('/', amenitiesController.getAllAmenities)
amenitiesRouter.post('/create', amenitiesController.createAmenities)
amenitiesRouter.put('/update/:id', amenitiesController.updateAmenities)

module.exports = amenitiesRouter