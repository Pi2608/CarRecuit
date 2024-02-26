const amenities = require('../models/Amenities')

const getAllAmenities = async(req, res)=>{
    const response = await amenities.getAllAmenities()
    res.json(response)
}
const createAmenities = async (req, res)=>{
    const name = req.body.name
    const response = await amenities.createAmenities(name)
    res.json(response)
}
const updateAmenities = async (req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const response = await amenities.updateAmenities(id, name)
    res.json(response)
}
module.exports={
    getAllAmenities,
    createAmenities,
    updateAmenities
}