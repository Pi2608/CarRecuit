const express = require('express')
const rentController = require ('../controllers/RentController')

const rentRouter = express.Router()

rentRouter.get('/rented/:userId', rentController.getRentAlreadyPayment)// tất cả rent đã đc thuê
rentRouter.get('/counting/:carId', rentController.getCountRentalCar)
rentRouter.get('/schedule/:carId', rentController.getCarRentalSchedule)
rentRouter.post('/statistic', rentController.statisticRentalByYear)
rentRouter.post('/earning/statistic', rentController.statisticEarningByYear)
rentRouter.get('/statisticCurrent', rentController.statisticRentalThisMonth)
rentRouter.get('/earning/statisticCurrent', rentController.statisticEarningThisMonth)
rentRouter.get('/earning/statisticToday', rentController.statisticEarningToday)
rentRouter.get('/detail/:rentId', rentController.getRentDetailByRentId)
rentRouter.get('/detailCurrent/:userId', rentController.getRentDetailCurrent) // lấy rent Detail của hiện tại chưa thanh toán
rentRouter.post('/addCar', rentController.addRentDetail)
rentRouter.get('/deleteCar', rentController.deleteRentDetail)
rentRouter.get('/confirmPayment/:userId', rentController.confirmPayment)
rentRouter.get('/acceptRentDetail', rentController.acceptRentDetail)
rentRouter.get('/cancelByUser', rentController.cancelRentDetailByUser)
rentRouter.get('/cancelByOwner', rentController.cancelRentDetailByOwner)

module.exports= rentRouter