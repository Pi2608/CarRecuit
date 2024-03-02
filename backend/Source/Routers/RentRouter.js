const express = require('express')
const rentController = require ('../controllers/RentController')

const rentRouter = express.Router()

rentRouter.get('/counting/:carId', rentController.getCountRentalCar)
rentRouter.get('/schedule/:carId', rentController.getCarRentalSchedule)
rentRouter.post('/statistic', rentController.statisticRentalByYear)
rentRouter.get('/detail/:userId', rentController.getRentDetailCurrent)

module.exports= rentRouter