const express = require('express')
const userController = require('../controllers/UserController')
const carController = require('../controllers/CarController')

const carRouter = express.Router()

carRouter.get('/' ,carController.getAllCarsInUse)
carRouter.get('/all', carController.getAllCars)
carRouter.get('/brand', carController.getBrandCar)
carRouter.get('/type/brand/:carBrandId', carController.getCarType)
carRouter.get('/type/:typeId', carController.getCarTypeByTypeId)
carRouter.get('/recommend', carController.recomendCar)
carRouter.post('/filter', carController.filterCars)
carRouter.get('/request', carController.requestAcceptedCar)
carRouter.put('/request/edit', carController.editAcceptedCar)
carRouter.get('/:carId', carController.getCarById)
carRouter.get('/owner/:ownerId', carController.getAllCarsOfOwner)
carRouter.get('/feedback/:carId', carController.showCarFeedback)
carRouter.post('/new/:ownerId', carController.uploadImgs ,carController.addCarRental)
carRouter.post('/update/:carId', carController.uploadImgs, carController.updateCarRental)
carRouter.put('/delete/:carId', carController.deleteCarRental)
carRouter.post('/filterLocationDate', carController.filterLocationDate)



module.exports=carRouter