const car = require('../models/Car')

const getAllCarsInUse = async(req, res)=>{
    try {
        const response = await car.getAllCarsInUse()
        res.json(response)
    } catch (error) {
        
    }
}
module.exports={
    getAllCarsInUse
}