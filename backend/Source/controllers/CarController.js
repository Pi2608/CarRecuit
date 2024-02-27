const car = require('../models/Car')

const getAllCarsInUse = async(req, res)=>{
    try {
        const response = await car.getAllCarsInUse()
        res.json(response)
    } catch (error) {
        
    }
}
const getAllCarsOfOwner = async(req, res)=>{
    try {
        const ownerId = req.params.ownerId
        const response = await car.getAllCarsOfOwner(ownerId)
        res.json(response)
    } catch (error) {
        
    }
}
const showCarFeedback = async(req, res)=>{
    try {
        const carId = req.params.carId
        const response = await car.showCarFeedback(carId)
        res.json(response)
    } catch (error) {
        
    }
}
const getCarById = async(req, res)=>{
    try {
        const carId = req.params.carId
        const response = await car.getCarById(carId)
        res.json(response)
    } catch (error) {
        
    }
}
const filterCars = async (req, res)=>{
    try {
        const carTypeId = req.body.carTypeId
        const minPrice = req.body.minPrice
        const maxPrice = req.body.maxPrice
        const seats = req.body.seats
        const typeOfFuels = req.body.typeOfFuels
        const response = await car.filterCars(carTypeId, minPrice, maxPrice, seats, typeOfFuels)
        res.json(response)
    } catch (error) {
        
    }
}
module.exports={
    getAllCarsInUse,
    getAllCarsOfOwner,
    showCarFeedback,
    getCarById,
    filterCars
}