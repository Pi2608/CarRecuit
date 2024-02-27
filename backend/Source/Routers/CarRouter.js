const express = require('express')
const carController = require('../controllers/CarController')

const carRouter = express.Router()

carRouter.get('/', carController.getAllCarsInUse)
carRouter.get('/:carId', carController.getCarById)
carRouter.get('/owner/:ownerId', carController.getAllCarsOfOwner)
carRouter.get('/feedback/:carId', carController.showCarFeedback)
carRouter.post('/filter', carController.filterCars)

module.exports=carRouter