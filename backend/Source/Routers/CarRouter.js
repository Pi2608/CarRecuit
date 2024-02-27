const express = require('express')
const carController = require('../controllers/CarController')

const carRouter = express.Router()

carRouter.get('/', carController.getAllCarsInUse)

module.exports=carRouter