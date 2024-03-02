const rent = require('../models/Rent')

const getCountRentalCar = async(req, res)=>{
    try {
        const carId = req.params.carId
        const response = await rent.countRentalCar(carId)
        res.json(response)
    } catch (error) {
        
    }
}

const getCarRentalSchedule = async(req, res)=>{
    try {
        const carId = req.params.carId
        const response = await rent.carRentalSchedule(carId)
        res.json(response)
    } catch (error) {
        
    }
}
const statisticRentalByYear = async(req, res)=>{
    try {
        const year = req.body.year
        const response = await rent.statisticRentalByYear(year)
        res.json(response)
    } catch (error) {
        
    }
}
const getRentDetailCurrent = async(req, res)=>{
    try {
        const userId = req.params.userId
        const response = await rent.getRentDetailCurrent(userId)
        res.json(response)
    } catch (error) {
        
    }
}
module.exports= {
    getCountRentalCar,
    getCarRentalSchedule,
    statisticRentalByYear,
    getRentDetailCurrent
}