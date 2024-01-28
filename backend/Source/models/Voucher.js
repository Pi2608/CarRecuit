const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");

const getVoucherIdByCode= async(code)=>{
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
module.exports= {
    getVoucherIdByCode
}