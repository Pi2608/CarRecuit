const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");

const getVoucherIdByCode = async (code) => {
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select id From [dbo].[voucher] where voucherCode = @Code';
        const result = await poolConnection.request()
            .input('Code', sql.NVarChar, code)
            .query(query)
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}
const getAllVouchers = async () => {
    try {
        let pool = await sql.connect(config);
        let vouchers = await pool.request().query("SELECT * FROM Vouchers");
        return vouchers.recordset;
    } catch (err) {
        throw new Error(`Error getting all vouchers: ${err.message}`);
    }
};

const createVoucher = async (voucherCode, discount, startDate, endDate) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("voucherCode", sql.NVarChar, voucherCode)
            .input("discount", sql.Float, discount)
            .input("startDate", sql.DateTime, startDate)
            .input("endDate", sql.DateTime, endDate)
            .query(
                "INSERT INTO Vouchers (voucherCode, discount, startDate, endDate) VALUES (@voucherCode, @discount, @startDate, @endDate)"
            );
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error adding voucher: ${err.message}`);
    }
};

const updateVoucher = async (id, voucherCode, discount, startDate, endDate) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("id", sql.Int, id)
            .input("voucherCode", sql.NVarChar, voucherCode)
            .input("discount", sql.Float, discount)
            .input("startDate", sql.DateTime, startDate)
            .input("endDate", sql.DateTime, endDate)
            .query(
                "UPDATE Vouchers SET voucherCode = @voucherCode, discount = @discount, startDate = @startDate, endDate = @endDate WHERE id = @id"
            );
        return result.rowsAffected;
    } catch (err) {
        throw new Error(`Error updating voucher: ${err.message}`);
    }
};

const deleteVoucher = async (id) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool
            .request()
            .input("id", sql.Int, id)
            .query("DELETE FROM Vouchers WHERE id = @id");

        // Check if rows were affected by the DELETE query
        if (result.rowsAffected > 0) {
            // Update the isDeleted column to true
            await pool
                .request()
                .input("id", sql.Int, id)
                .query("UPDATE Vouchers SET isDeleted = 1 WHERE id = @id");
            return true; // Voucher deleted successfully
        } else {
            return false; // No voucher was deleted
        }
    } catch (err) {
        throw new Error(`Error deleting voucher: ${err.message}`);
    }
};


module.exports = {
    getAllVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucherIdByCode,
};
