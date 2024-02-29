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
const addRentDetail = async (req, res)=>{
    try {
        const userId = req.query.userId
        const carId = req.query.carId
        const pick_up = req.body.pick_up
        const drop_off = req.body.drop_off
        const voucherCode = req.body.voucherCode
        const response = await rent.addRentDetail(userId,carId,pick_up,drop_off,voucherCode)
        res.json(response)
    } catch (error) {
        
    }
}
const deleteRentDetail = async (req,res)=>{
    try {
        const userId = req.query.userId
        const rentDetailId = req.query.rentDetailId
        const response = await rent.deleteRentDetail(userId, rentDetailId)
        res.json(response)
    } catch (error) {
        
    }
}
const confirmPayment = async (req,res)=>{
    try {
        const userId = req.params.userId
        const response = await rent.confirmPayment(userId)
        res.json(response) 
    } catch (error) {
        
    }
}
const acceptRentDetail = async(req,res)=>{
    try {   
        const notificationId = req.query.notificationId
        const ownerId = req.query.ownerId
        const response = await rent.acceptRentDetail(notificationId, ownerId)
        res.json(response)
    } catch (error) {
        
    }
}

const cancelRentDetailByUser = async(req,res)=>{
    try {
        const rentDetailId = req.query.rentDetailId
        const userId = req.query.userId
        const response = await rent.cancelRentDetailByUser(rentDetailId, userId)
        res.json(response)
    } catch (error) {
        
    }
}

const cancelRentDetailByOwner = async(req, res)=>{
    try {
        const notificationId = req.query.notificationId
        const ownerId = req.query.notificationId
        const response = await rent.cancelRentDetailByOwner(notificationId, ownerId)
        res.json(response)
    } catch (error) {
        
    }
}

module.exports= {
    getCountRentalCar,
    getCarRentalSchedule,
    statisticRentalByYear,
    getRentDetailCurrent,
    addRentDetail,
    deleteRentDetail,
    confirmPayment,
    acceptRentDetail,
    cancelRentDetailByOwner,
    cancelRentDetailByUser
}