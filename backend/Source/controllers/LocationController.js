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

module.exports={
    getCarLocation,
    addCarRentLocation
}