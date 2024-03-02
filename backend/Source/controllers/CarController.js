const car = require('../models/Car')
const multer = require("multer")
const Uitl = require("../Util/Util")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Source/photos');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

const uploadImgs = upload.array('images', 5)

const getAllCarsInUse = async(req, res)=>{
    try {
        await Uitl.deleteAllImages()
        const response = await car.getAllCarsInUse()
        res.json(response)
    } catch (error) {
        
    }
}
const getBrandCar = async (req, res)=>{
    try {
        const response = await car.getBrandCar()
        res.json(response)
    } catch (error) {
        
    }
}

const getCarType = async (req, res)=>{
    try {
        const carBrandId = req.params.carBrandId
        const response = await car.getCarType(carBrandId)
        res.json(response)
    } catch (error) {
        
    }
}
const getAllCarsOfOwner = async(req, res)=>{
    try {
        await Uitl.deleteAllImages()
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
        await Uitl.deleteAllImages()
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
const addCarRental = async (req, res)=>{
    try {
        await Uitl.deleteAllImages()
        const ownerId = req.params.ownerId
        const carTypeId = req.body.carTypeId
        const CLP = req.body.CLP
        const price = req.body.price
        const description = req.body.description
        const seats = req.body.seats
        const year = req.body.year
        const typeOfFuels = req.body.typeOfFuels
        const ldescription = req.body.ldescription
        const imagePaths = req.files.map(file=>file.path);
        const amenities = JSON.parse(req.body.amenities)
        let imgs = [];
        for (const path of imagePaths) {
            try {
                const base64Code = await Uitl.encodeImage(path);
                imgs.push(base64Code);
            } catch (error) {
                console.error('Error encoding image:', error);
            }
        }
        const response = await car.addCarRental(ownerId, carTypeId, CLP, price, description, seats, year, typeOfFuels, ldescription, imgs, amenities)
        res.json(response)
    } catch (error) {
        
    }
}

const updateCarRental = async (req, res)=>{
    try {
        await Uitl.deleteAllImages()
        const carId = req.params.carId
        const carTypeId = req.body.carTypeId
        const CLP = req.body.CLP
        const price = req.body.price
        const discount = req.body.discount
        const description = req.body.description
        const seats = req.body.seats
        const year = req.body.year
        const typeOfFuels = req.body.typeOfFuels
        const status = req.body.status
        const ldescription = req.body.ldescription
        const imagePaths = req.files.map(file=>file.path);
        const amenities = JSON.parse(req.body.amenities)
        let imgs = [];
        for (const path of imagePaths) {
            try {
                const base64Code = await Uitl.encodeImage(path);
                imgs.push(base64Code);
            } catch (error) {
                console.error('Error encoding image:', error);
            }
        }
        const response = await car.updateCarRental(carId, carTypeId, CLP, price, discount , description, seats, year, typeOfFuels, status, ldescription, imgs, amenities)
        res.json(response)
    } catch (error) {
        
    }
}
const deleteCarRental = async (req, res)=>{
    try {
        const carId = req.params.carId
        const response = await car.deleteCarRental(carId)
        res.json(response)
    } catch (error) {
        
    }
}
module.exports={
    uploadImgs,
    getAllCarsInUse,
    getAllCarsOfOwner,
    showCarFeedback,
    getCarById,
    filterCars,
    addCarRental,
    updateCarRental,
    deleteCarRental,
    getBrandCar,
    getCarType,
}