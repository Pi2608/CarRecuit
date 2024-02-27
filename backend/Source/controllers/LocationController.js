const location = require('../models/Location')

const getCarLocation = async(req, res)=>{
    try {
        const carId = req.query.carId
        const typeLocation = req.query.typeLocation
        const response = await location.getCarLocation(carId,typeLocation)
        res.json(response)
    } catch (error) {
        
    }
}

module.exports={
    getCarLocation
}