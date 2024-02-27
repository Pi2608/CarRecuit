const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const Util = require("../Util/Util")

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
        return result.recordset[0]
    } catch (error) {
        console.log(error)
    }
}
const getVoucherById = async(id)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select * from dbo.voucher where id = @id'
        const result = await poolConnection.request()
        .input('id', sql.Int, id)
        .query(query)
        return result.recordset[0]
    } catch (error) {
        console.log(error)
    }
}
const getAllVoucher = async()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select * from dbo.voucher'
        const result = await poolConnection.request()
        .query(query)
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}

const createVoucher = async(discount, startDate, endDate)=>{
    try {
        let poolConnection = await sql.connect(config)
        let voucherCode
        let status = true
        // check duplicate
        while(status){
            voucherCode = 'Carflex-'+ (await Util.generateRandomString(8))
            const voucher = await getVoucherByCode(voucherCode)
            if(voucher == null){
                status = false
            } 
        }
        console.log(voucherCode)
        if(await Util.compareDates(startDate, endDate)){
            const query = `Insert into dbo.voucher (voucherCode, discount, startDate, endDate, isDeleted) values (@voucherCode, @discount, @startDate, @endDate, 0)`
            await poolConnection.request()
            .input('voucherCode', sql.NVarChar, voucherCode)
            .input('discount', sql.Float, discount)
            .input('startDate', sql.DateTime, startDate)
            .input('endDate', sql.DateTime, endDate)
            .query(query)
            return{
                message: "Tạo voucher thành công"
            }
        }else{
            return{
                message: "Ngày bắt đầu phải bé hơn ngày kết thúc"
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const deleteVoucher = async(id)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = "Update dbo.voucher set isDeleted = 1 where id= @id"
        await poolConnection.request()
        .input('id', sql.Int, id)
        .query(query)
        return{
            message: "Xóa thành công"
        }
    } catch (error) {
        console.log(error)
    }
}
const updateVoucher = async(id, voucherCode, discount, startDate, endDate)=>{
    try {
        let poolConnection = await sql.connect(config)
        if(await Util.compareDates(startDate, endDate)){
            const query =  `Update dbo.voucher set voucherCode = @voucherCode, discount = @discount, startDate = @startDate, endDate = @endDate
                        where id =@id`
            await poolConnection.request()
            .input('voucherCode', sql.NVarChar, voucherCode)
            .input('discount', sql.Float, discount)
            .input('startDate', sql.DateTime, startDate)
            .input('endDate', sql.DateTime, endDate)
            .input('id', sql.Int, id)
            .query(query)
            return{
                message: "Update thành công"
            }
        }else{
            return{
                message: "Ngày bắt đầu phải bé hơn ngày kết thúc"
            }
        }
    } catch (error) {
        console.log(error)
    }
} 
module.exports= {
    checkVoucher,
    getVoucherByCode,
    getVoucherById,
    getAllVoucher,
    createVoucher,
    deleteVoucher,
    updateVoucher
}
