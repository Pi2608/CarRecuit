const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const Util = require("../Util")

<<<<<<< HEAD
const getVoucherIdByCode = async (code) => {
=======
const checkVoucher = async(userId, code)=>{
>>>>>>> 1b92c73252dbe7825855d1a045a084d6032a6f84
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `Select id, startDate, endDate, isDeleted from dbo.voucher
                        Where voucherCode = @code`
        const result1 = await poolConnection.request()
        .input('code', sql.NVarChar, code)
        .query(query1)
        const info = result1.recordset
        const query2 = `Select * from dbo.voucherUser where 
                        voucherId = @voucherId and user = @userId`
        const result2 = await poolConnection.request()
        .input('voucherId', sql.Int, info.id)
        .input('userId', sql.Int, userId)
        .query(query2)
        const voucherUser = result2.recordset
        if(info !=null){
            if(voucherUser == null){
                if(info.isDeleted == false){
                    const currentTime = await Util.currentTime()
                    if(currentTime< info.endDate && currentTime> info.startDate){
                        return{
                            id : info.id,
                            message: 'Kích hoạt mã thành công',
                            valid: true
                        }
                    }else{
                        return{
                            message: 'Mã nhập không khả dụng',
                            valid: false
                        }
                    }
                }else{
                    return{
                        message: 'Mã nhập không khả dụng',
                        valid: false
                    }
                }
            }else{
                return{
                    message: 'Mã đã qua sử dụng',
                    valid: false,
                }
            }
        }else{
            return{
                message: 'Mã nhập không hợp lệ',
                valid: false
            }
        }
    } catch (error) {
        
    }
}
const getVoucherByCode = async(code)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[voucher] where voucherCode = @Code';
        const result = await poolConnection.request()
            .input('Code', sql.NVarChar, code)
            .query(query)
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}
<<<<<<< HEAD
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
=======
module.exports= {
    checkVoucher,
    getVoucherByCode
}
>>>>>>> 1b92c73252dbe7825855d1a045a084d6032a6f84
