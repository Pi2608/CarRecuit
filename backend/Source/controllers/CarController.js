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
const recomendCar = async (req, res)=>{
    try {
        await Uitl.deleteAllImages()
        const items = req.query.items
        const response = await car.recomendCar(items)
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
const getCarTypeByTypeId = async (req,res)=>{
    try {
        const typeId = req.params.typeId
        const response = await car.getCarTypeByTypeId (typeId)
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
        // const cars = req.body.cars
        // const carTypeId = req.body.carTypeId
        // const minPrice = req.body.minPrice
        // const maxPrice = req.body.maxPrice
        // const seats = req.body.seats
        // const typeOfFuels = req.body.typeOfFuels
        // const gearStick = req.body.gearStick
        const { cars, carTypeId, minPrice, maxPrice, seats, typeOfFuels, gearStick } = req.body;
        const response = await car.filterCars(cars,carTypeId, minPrice, maxPrice, seats, typeOfFuels, gearStick)
        res.json(response)
    } catch (error) {
        
    }
}
const addCarRental = async (req, res)=>{
    try {
        const ownerId = req.params.ownerId
        const carTypeId = req.body.carTypeId
        const CLP = req.body.CLP
        const price = req.body.price
        const description = req.body.description
        const seats = req.body.seats
        const year = req.body.year
        const gearStick = req.body.gearStick
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
        const response = await car.addCarRental(ownerId, carTypeId, CLP, price, description, seats, year, gearStick, typeOfFuels, ldescription, imgs, amenities)
        res.json(response)
    } catch (error) {
        
    }
}

const updateCarRental = async (req, res)=>{
    try {
        const carId = req.params.carId
        const carTypeId = req.body.carTypeId
        const CLP = req.body.CLP
        const price = req.body.price
        const discount = req.body.discount
        const description = req.body.description
        const seats = req.body.seats
        const year = req.body.year
        const gearStick = req.body.gearStick
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
        const response = await car.updateCarRental(carId, carTypeId, CLP, price, discount , description, seats, year, gearStick, typeOfFuels, status, ldescription, imgs, amenities)
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

const requestAcceptedCar = async (req, res)=>{
    try {
        const response = await car.requestAcceptedCar()
        res.json(response)
    } catch (error) {
        
    }
}
const editAcceptedCar = async (req,res)=>{
    try {
        const status = req.query.status
        const carId = req.query.carId
        const response = await car.editAcceptedCar(status, carId)
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
    getCarTypeByTypeId,
    recomendCar,
    requestAcceptedCar,
    editAcceptedCar
}