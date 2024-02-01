const express = require('express');
const router = express.Router();
const rentController = require('../controllers/RentController');

// Routes for Rental Records
router.post('/rents', rentController.createRent);
router.get('/rents', rentController.getAllRents);
router.get('/rents/:id', rentController.getRentById);
router.put('/rents/:id', rentController.updateRent);
router.delete('/rents/:id', rentController.deleteRent);
router.get('/users/:userId/rents', rentController.getRentsByUser);

// Routes for Rental Detail Records
router.post('/rents/:rentId/rent-details', rentController.createRentDetail);
router.get('/rents/:rentId/rent-details', rentController.getAllRentDetails);
router.get('/rents/:rentId/rent-details/:id', rentController.getRentDetailById);
router.put('/rents/:rentId/rent-details/:id', rentController.updateRentDetail);
router.delete('/rents/:rentId/rent-details/:id', rentController.deleteRentDetail);
