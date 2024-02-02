const Rent = require('../models/Rent');

// Controller function to create a new rental record
const createRent = async (req, res) => {
    try {
        const { id, paymentId, userId, total } = req.body;
        const result = await Rent.createRent(id, paymentId, userId, total);
        res.status(201).json({ message: 'Rent created successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to get all rental records
const getAllRents = async (req, res) => {
    try {
        const rents = await Rent.getAllRents();
        res.status(200).json({ data: rents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to update a rental record
const updateRent = async (req, res) => {
    try {
        const { id, paymentId, userId, total } = req.body;
        const result = await Rent.updateRent(id, paymentId, userId, total);
        res.status(200).json({ message: 'Rent updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to delete a rental record
const deleteRent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Rent.deleteRent(id);
        res.status(200).json({ message: 'Rent deleted successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to get a rental record by its ID
const getRentById = async (req, res) => {
    try {
        const { id } = req.params;
        const rent = await Rent.getRentById(id);
        res.status(200).json({ data: rent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to get all rental records associated with a specific user
const getRentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const rents = await Rent.getRentsByUser(userId);
        res.status(200).json({ data: rents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Controller function to create a new rental detail record
const createRentDetail = async (req, res) => {
    try {
        const { id, carId, pick_up, drop_off, rentId, voucherId, status } = req.body;
        const result = await RentDetail.createRentDetail(id, carId, pick_up, drop_off, rentId, voucherId, status);
        res.status(201).json({ message: 'Rent detail created successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to update a rental detail record
const updateRentDetail = async (req, res) => {
    try {
        const { id, carId, pick_up, drop_off, rentId, voucherId, status } = req.body;
        const result = await RentDetail.updateRentDetail(id, carId, pick_up, drop_off, rentId, voucherId, status);
        res.status(200).json({ message: 'Rent detail updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to delete a rental detail record
const deleteRentDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await RentDetail.deleteRentDetail(id);
        res.status(200).json({ message: 'Rent detail deleted successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to get all rental detail records
const getAllRentDetails = async (req, res) => {
    try {
        const rentDetails = await RentDetail.getAllRentDetails();
        res.status(200).json({ data: rentDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to get a rental detail record by its ID
const getRentDetailById = async (req, res) => {
    try {
        const { id } = req.params;
        const rentDetail = await RentDetail.getRentDetailById(id);
        res.status(200).json({ data: rentDetail });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createRent,
    getAllRents,
    updateRent,
    deleteRent,
    getRentById,
    getRentsByUser,

    createRentDetail,
    getAllRentDetails,
    updateRentDetail,
    deleteRentDetail,
    getRentDetailById,
};

