const location = require('../models/Location')

const getCarLocation = async(req, res)=>{
    try {
        const carId = req.query.carId
        const typeLocationId = req.query.typeLocationId
        const response = await location.getCarLocation(carId,typeLocationId)
        res.json(response)
    } catch (error) {
        
    }
}
const addCarRentLocation = async(req, res)=>{
    try {
        const carId = req.query.carId
        const typeLocationId = req.query.typeLocationId
        const latitude = req.body.latitude
        const longitude = req.body.longitude
        const description = req.body.description
        const response = await location.addCarRentLocation(carId,typeLocationId,latitude,longitude,description)
        res.json(response) 
    } catch (error) {
        
    }
}

const getLocationAll = async(req, res)=>{
    try {
        const response = await location.getLocationAll()
        res.json(response)
    } catch (error) {
        
    }
}
const getLocationInfo = async (req, res)=>{
    try {
        const lat = req.query.lat
        const lng = req.query.lng
        const response = await location.getLocationInfo(lat, lng)
        res.json(response)
    } catch (error) {
        
    }
}

const addCityAll = async (req, res)=>{
    try {
        const response = await location.addCityAll()
        res.json(response)
    } catch (error) {
        
    }
}

module.exports={
    getCarLocation,
    addCarRentLocation,
    getLocationAll,
    getLocationInfo,
    addCityAll
}