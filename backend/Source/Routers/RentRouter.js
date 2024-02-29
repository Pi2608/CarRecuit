const express = require('express')
const rentController = require ('../controllers/RentController')

const rentRouter = express.Router()

rentRouter.get('/counting/:carId', rentController.getCountRentalCar)
rentRouter.get('/schedule/:carId', rentController.getCarRentalSchedule)
rentRouter.post('/statistic', rentController.statisticRentalByYear)
rentRouter.get('/detail/:userId', rentController.getRentDetailCurrent)
rentRouter.post('/addCar', rentController.addRentDetail)
rentRouter.get('/deleteCar', rentController.deleteRentDetail)
rentRouter.get('/confirmPayment/:userId', rentController.confirmPayment)
rentRouter.get('/acceptRentDetail', rentController.acceptRentDetail)
rentRouter.get('/cancelByUser', rentController.cancelRentDetailByUser)
rentRouter.get('/cancelByOwner', rentController.cancelRentDetailByOwner)

module.exports= rentRouter