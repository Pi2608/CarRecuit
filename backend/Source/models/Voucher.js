const sql = require('mssql');
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
        const info = result1.recordset[0]
        if(info !=null){
            const query2 = `Select * from dbo.voucherUser where 
                        voucherId = @voucherId and userId = @userId`
            const result2 = await poolConnection.request()
            .input('voucherId', sql.Int, info.id)
            .input('userId', sql.Int, userId)
            .query(query2)
            const voucherUser = result2.recordset[0]
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
        console.log(error)
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

const getAllVoucherInUse = async()=>{
    try {
        let poolConnection = await sql.connect (config)
        const query1 = `Select * from dbo.voucher where isDeleted = 0`
        const result1 = await poolConnection.request()
        .query(query1)
        const vouchers = result1.recordset
        const voucherInUse = []
        for (let voucher of vouchers){
            if (await Util.compareDates(voucher.startDate, await Util.currentTime()) && await Util.compareDates(await Util.currentTime(), voucher.endDate)){
                voucherInUse.push(voucher)
            }
        }
        return voucherInUse
    } catch (error) {
        
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
        if(await Util.compareDates(startDate, endDate)){
            const query = `Insert into dbo.voucher (voucherCode, discount, startDate, endDate, isDeleted) values (@voucherCode, @discount, @startDate, @endDate, 0)`
            await poolConnection.request()
            .input('voucherCode', sql.NVarChar, voucherCode)
            .input('discount', sql.Float, discount)
            .input('startDate', sql.DateTime,await Util.inputDate(startDate))
            .input('endDate', sql.DateTime,await Util.inputDate(endDate))
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
            .input('startDate', sql.DateTime,await Util.inputDate(startDate))
            .input('endDate', sql.DateTime,await Util.inputDate(endDate))
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
const createVoucherAWeek = async(discount)=>{
    const startDate = await Util.currentTime()
    var date = new Date(startDate)
    date.setDate(date.getDate()+7)
    const endDate = date
    await createVoucher(discount, startDate, endDate)
}

module.exports= {
    checkVoucher,
    getVoucherByCode,
    getVoucherById,
    getAllVoucher,
    createVoucher,
    deleteVoucher,
    updateVoucher,
    createVoucherAWeek,
    getAllVoucherInUse
}
