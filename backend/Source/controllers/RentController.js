const rent = require('../models/Rent')
const util = require('../Util/Util')

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
const statisticRentalThisMonth = async(req,res)=>{
    try {
        const response = await rent.statisticRentalThisMonth()
        res.json(response)
    } catch (error) {
        
    }
}
const statisticEarningThisMonth = async(req, res)=>{
    try {
        const response = await rent.statisticEarningThisMonth()
        res.json(response)
    } catch (error) {
        
    }
}
const statisticEarningByYear = async(req, res)=>{
    try {
        const year = req.body.year
        const response = await rent.statisticEarningByYear(year)
        res.json(response)
    } catch (error) {
        
    }
}
const statisticEarningToday = async (req, res)=>{
    try {
        const response = await rent.statisticEarningToday()
        res.json(response)
    } catch (error) {
        
    }
}
const getRentDetailCurrent = async(req, res)=>{
    try {
        util.deleteAllImages()
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
        const rentDetailId = req.query.rentDetailId
        const response = await rent.acceptRentDetail(rentDetailId)
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
        const rentDetailId = req.query.rentDetailId
        const response = await rent.cancelRentDetailByOwner(rentDetailId)
        res.json(response)
    } catch (error) {
        
    }
}

const getRentAlreadyPayment = async(req,res)=>{
    try {
        const userId = req.params.userId
        const response = await rent.getRentAlreadyPayment(userId)
        res.json(response)
    } catch (error) {
        
    }
}

const getRentDetailByRentId = async(req,res)=>{
    try {
        const rentId = req.params.rentId
        const response = await rent.getRentDetailByRentId(rentId)
        res.json(response)
    } catch (error) {
        
    }
}

const currentTrip = async (req, res)=>{
    try {
        // await util.deleteAllImages()
        const userId = req.params.userId
        const response = await rent.currentTrip(userId)
        res.json(response)
    } catch (error) {
        
    }
}

const historyTrip = async (req,res)=>{
    try {
        // await util.deleteAllImages()
        const userId = req.params.userId
        const response = await rent.historyTrip(userId)
        res.json(response)
    } catch (error) {
        
    }
}

const ownerRentDetailRequest = async(req,res)=>{
    try {
        // await util.deleteAllImages()
        const ownerId = req.params.ownerId
        const response = await rent.ownerRentDetailRequest(ownerId)
        res.json(response)
    } catch (error) {
        
    }
}

const ownerRentDetailUpcoming = async(req,res)=>{
    try {
        // await util.deleteAllImages()
        const ownerId = req.params.ownerId
        const response = await rent.ownerRentDetailUpcoming(ownerId)
        res.json(response)
    } catch (error) {
        
    }
}

const findRentDetailByNotification = async (req,res)=>{
    try {
        const notificationId = req.params.notificationId
        const response = await rent.findRentDetailByNotification(notificationId)
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
    cancelRentDetailByUser,
    getRentAlreadyPayment,
    getRentDetailByRentId,
    statisticRentalThisMonth,
    statisticEarningThisMonth,
    statisticEarningByYear,
    statisticEarningToday,
    currentTrip,
    historyTrip,
    ownerRentDetailRequest,
    ownerRentDetailUpcoming,
    findRentDetailByNotification
}