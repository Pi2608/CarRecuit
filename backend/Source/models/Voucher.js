const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const Util = require("../Util")

const checkVoucher = async(userId, code)=>{
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
module.exports= {
    checkVoucher,
    getVoucherByCode

}
