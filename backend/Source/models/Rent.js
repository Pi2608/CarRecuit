// models/rent.js
const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");

// Method to create a rental record
const createRent = async (id, paymentId, userId, total) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("id", sql.Int, id)
            .input("paymentId", sql.Int, paymentId)
            .input("userId", sql.Int, userId)
            .input("total", sql.Money, total)
            .query(
                "INSERT INTO Rent (id, paymentId, userId, total) VALUES (@id, @paymentId, @userId, @total)"
            );
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error adding rent: ${err.message}`);
    }
};

// Method to retrieve all rental records
const getAllRents = async () => {
    try {
        let pool = await sql.connect(config);
        let rents = await pool.request().query("SELECT * FROM Rent");
        return rents.recordset;
    } catch (err) {
        throw new Error(`Error getting all rents: ${err.message}`);
    }
};

// Method to update a rental record
const updateRent = async (id, paymentId, userId, total) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("id", sql.Int, id)
            .input("paymentId", sql.Int, paymentId)
            .input("userId", sql.Int, userId)
            .input("total", sql.Money, total)
            .query(
                "UPDATE Rent SET paymentId = @paymentId, userId = @userId, total = @total WHERE id = @id"
            );
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error updating rent: ${err.message}`);
    }
};

const deleteRent = async (req, res) => {
    const { id } = req.params;
    try {
        // Update the IsDeleted column instead of physically deleting the record
        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("UPDATE Rent SET IsDeleted = 1 WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Rent not found" });
        }

        return res.status(200).json({ message: "Rent marked as deleted" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// Method to get a rental record by its ID
const getRentById = async (id) => {
    try {
        let pool = await sql.connect(config);
        let rent = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM Rent WHERE id = @id");

        return rent.recordset[0]; // Assuming id is unique, so we return the first record
    } catch (err) {
        throw new Error(`Error getting rent by ID: ${err.message}`);
    }
};

// Method to get all rental records associated with a specific user
const getRentsByUser = async (userId) => {
    try {
        let pool = await sql.connect(config);
        let rents = await pool
            .request()
            .input("userId", sql.Int, userId)
            .query("SELECT * FROM Rent WHERE userId = @userId");

        return rents.recordset;
    } catch (err) {
        throw new Error(`Error getting rents by user: ${err.message}`);
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////RentDetail/////////////////////////////////////////////////////////
// Method to create a rental detail record
const createRentDetail = async (id, carId, pick_up, drop_off, rentId, voucherId, status) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("id", sql.Int, id)
            .input("carId", sql.Int, carId)
            .input("pick_up", sql.DateTime, pick_up)
            .input("drop_off", sql.DateTime, drop_off)
            .input("rentId", sql.Int, rentId)
            .input("voucherId", sql.Int, voucherId)
            .input("status", sql.Bit, status)
            .query(
                "INSERT INTO RentDetail (id, carId, pick_up, drop_off, rentId, voucherId, status) VALUES (@id, @carId, @pick_up, @drop_off, @rentId, @voucherId, @status)"
            );
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error adding rent detail: ${err.message}`);
    }
};

// Method to update a rental detail record
const updateRentDetail = async (id, carId, pick_up, drop_off, rentId, voucherId, status) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("id", sql.Int, id)
            .input("carId", sql.Int, carId)
            .input("pick_up", sql.DateTime, pick_up)
            .input("drop_off", sql.DateTime, drop_off)
            .input("rentId", sql.Int, rentId)
            .input("voucherId", sql.Int, voucherId)
            .input("status", sql.Bit, status)
            .query(
                "UPDATE RentDetail SET carId = @carId, pick_up = @pick_up, drop_off = @drop_off, rentId = @rentId, voucherId = @voucherId, status = @status WHERE id = @id"
            );
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error updating rent detail: ${err.message}`);
    }
};

// Method to delete a rental detail record
const deleteRentDetail = async (id) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("DELETE FROM RentDetail WHERE id = @id");

        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error deleting rent detail: ${err.message}`);
    }
};
// Method to retrieve all rental detail records
const getAllRentDetails = async () => {
    try {
        let pool = await sql.connect(config);
        let rentDetails = await pool.request().query("SELECT * FROM RentDetail");
        return rentDetails.recordset;
    } catch (err) {
        throw new Error(`Error getting all rent details: ${err.message}`);
    }
};

// Method to get a rental detail record by its ID
const getRentDetailById = async (id) => {
    try {
        let pool = await sql.connect(config);
        let rentDetail = await pool
            .request()
            .input("id", sql.Int, id)
            .query("SELECT * FROM RentDetail WHERE id = @id");

        return rentDetail.recordset[0]; // Assuming id is unique, so we return the first record
    } catch (err) {
        throw new Error(`Error getting rent detail by ID: ${err.message}`);
    }
};


module.exports = {
    createRent,
    getAllRents,
    updateRent,
    deleteRent,
    getRentById,

    createRentDetail,
    getAllRentDetails,
    updateRentDetail,
    deleteRentDetail,
    getRentDetailById,
};
