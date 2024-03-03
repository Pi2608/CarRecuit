const express = require('express')
const userController = require('../controllers/UserController')
const carController = require('../controllers/CarController')

const carRouter = express.Router()

carRouter.get('/' ,carController.getAllCarsInUse)
carRouter.get('/brand', carController.getBrandCar)
carRouter.get('/type/:carBrandId', carController.getCarType)
carRouter.get('/:carId', carController.getCarById)
carRouter.get('/owner/:ownerId', carController.getAllCarsOfOwner)
carRouter.get('/feedback/:carId', carController.showCarFeedback)
carRouter.post('/filter', carController.filterCars)
carRouter.post('/new/:ownerId', carController.uploadImgs ,carController.addCarRental)
carRouter.post('/update/:carId', carController.uploadImgs, carController.updateCarRental)
carRouter.put('/delete/:carId', carController.deleteCarRental)

module.exports=carRouter