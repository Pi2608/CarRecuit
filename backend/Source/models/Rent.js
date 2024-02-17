const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const Util = require("../Util/Util");
const voucher = require("./Voucher")
const car = require("./Car")
const user = require("./User")
const countRentalCar = async (carId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select COUNT(dbo.rentDetail.id) As rentCount 
                        From 
                            dbo.rentDetail
                        inner join dbo.rent 
                            on dbo.rent.id = dbo.rentDetail.rentId
                        Where 
                            dbo.rent.paymentId is not null and 
                            dbo.rentDetail.carId = @carId
                        group by 
                            bo.rentDetail.carId`
        const result = await poolConnection.request()
        .input('carId', sql.Int, carId)
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const statisticRentalByYear = async (year)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = `SELECT 
                            YEAR(dbo.rent.time) as year,
                            MONTH(dbo.rent.time) as month,
                            COUNT(*) as total
                        From
                            dbo.rent
                        Where
                            dbo.rent.paymentId is not null AND
                            YEAR(dbo.rent.time) = @year
                        Group By
                            YEAR(dbo.rent.time), MONTH(dbo.rent.time)
                        Order By
                            year, month`
        const result = await poolConnection.request()
        .input('year', sql.Int, year)
        .query(query)
        return result.recordset
    }catch(error){

    }
}

const createRent = async (userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const time = await Util.currentTime()
        const query = `Insert into dbo.rent (userId, total, time)
                        Values (@userId, 0, @time)`
        await poolConnection.request()
        .input('userId', sql.Int, userId)
        .input('time', sql.DateTime, time)
        .query(query)
    } catch (error) {
        
    }
}

const getCurrentRent = async(userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select Max(id) as id, total from dbo.rent
                        Where userId = @userId
                        And paymentId is null`
        const result = await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query)
        return result.recordset[0]
    } catch (error) {
        
    }
}

const getRentDetailCurrent = async (userId)=>{
    try {
        const rent = await getCurrentRent(userId)
        if(rent != null){
            let poolConnection = await sql.connect(config)
            const query = `Select * from dbo.rentDetail
                            where rentId = @rentId`
            const result = await poolConnection.request()
            .input('rentId', sql.Int, rent.id)
            .query(query)
            return result.recordset
        }else{
            return null
        }
    } catch (error) {
        
    }
}

const addRentDetail = async (userId, carId, pick_up, drop_off, voucherCode)=>{
    try {
        let rent = await getCurrentRent(userId)
        let poolConnection = await sql.connect(config)
        if(rent==null){
            createRent(userId)
            rent = await getCurrentRent(userId)
        }
        let voucherId = null;
        let voucherDiscount = 0;
        if(voucherCode != null){
            const checkVoucher = await voucher.checkVoucher(voucherCode)
            if(checkVoucher.valid == true){
                voucherId = checkVoucher.id
                const Voucher = voucher.getVoucherByCode(voucherCode)
                voucherDiscount = Voucher.discount
                const addDate = await Util.currentTime()
                
                const query1 =  `Insert into dbo.voucherUser (voucherId, userId, addDate)
                            values (@voucherId, @userId, @addDate)`
                await poolConnection.request()
                .input('voucherId', sql.Int, checkVoucher.id)
                .input('userId', sql.Int, userId)
                .input('addDate', sql.DateTime, addDate)
                .input(query1)
            }
        }
        const Car = await car.getCarById(carId)
        const discountCar = Car.discount
        const priceCar = Car.price
        const final = priceCar*(1-discountCar)*(1-voucherDiscount) 
        
        const query2 =  `Insert into dbo.rentDetail (carId, pick_up, drop_off, rentId, voucherId, status, total)
                            values (@carId, @pick_up, @drop_off, @rentId, @voucherId, 0, @final)`
        await poolConnection.request()
        .input('carId', sql.Int, carId)
        .input('pick_up', sql.DateTime, pick_up)
        .input('drop_off', sql.DateTime, drop_off)
        .input('rentId', sql.Int, rent.id)
        .input('voucherId', sql.Int, voucherId)
        .input('final', sql.Float, final)
        .query(query2)
        
        const query3 = `Update dbo.rent set total = total + @final
                        Where id = @id`
        await poolConnection.request()
        .input('final', sql.Float, final)
        .input('id', sql.Int, rent.id)
        .query(query3)
    } catch (error) {
        
    }
}

const deleteRentDetail = async(userId, rentDetailId)=>{
    try {
        let poolConnection = await sql.connect(config)
        
        const query1 = ` Select * from dbo.rentDetail
                        where id = @rentDetailId`
        const result = await poolConnection.request()
        .input("rentDetailId", sql.Int, rentDetailId)
        .query(query1)
        const RentDetail = result.recordset[0]
        
        const query2 = `Update dbo.rent set total = total -@rentDetailTotal
                        where id =@rentId`
        await poolConnection.request()
        .input("rentDetailTotal", sql.Float, RentDetail.total)
        .input("rentId", sql.Int, RentDetail.rentId)
        .query(query2)
        
        const query3 =`Delete from dbo.voucherUser 
                        where voucherId = @voucherId and userId = @userId`
        await poolConnection.request()
        .input("voucherId", sql.Int, RentDetail.voucherId)
        .input("userId", sql.Int, userId)
        .query(query3)

        const query4 = `Delete from dbo.rentDetail 
                        where id = @rentDetailId`
        await poolConnection.request()
        .input("rentDetailId", sql.Int, rentDetailId)
        .query(query4)
    } catch (error) {
        
    }
}

const confirmPayment = async (userId)=>{
    try {
        const rent = await getCurrentRent(userId)
        let poolConnection = await sql.connect(config)
        const User = await user.getUserById(userId)


        if(User.wallet>rent.total){

            let isDuplicated = true
            let paymentCode
            while(isDuplicated){
                paymentCode = await Util.generateRandomString(10);
                const query1 = `Select * from dbo.payment
                                where paymentCode =@paymentCode`
                const result1 = await poolConnection.request()
                .input("paymentCode", sql.NVarChar, paymentCode)
                .query(query1)
                const Payment = result1.recordset
                if(Payment == null){
                    isDuplicated = false
                }
            }
            const query2 = `Insert into dbo.payment (paymentCode, paymentDate) 
                            values (@paymentCode, @paymentDate)`
            await poolConnection.request()
            .input("paymentCode", sql.NVarChar, paymentCode)
            .input("paymentDate", sql.NVarChar, Util.currentTime())
            .query(query2)
            
            const query3 = `Update dbo.user set wallet = wallet - @rentTotal
                            where id = @userId`
            await poolConnection.request()
            .input("rentTotal", sql.Float, rent.total)
            .input("userId", sql.Int, userId)
            .query(query3)

            const query4 =  `Update dbo.rent 
                            set paymentId = (Select id from dbo.payment where paymentCode = @paymentCode)
                            where id = @rentId`
            await poolConnection.request()
            .input("paymentCode", sql.NVarChar, paymentCode)
            .input("rentId", sql.Int, rent.id)
            ,query(query4)
            const rentDetails = await getRentDetailCurrent(userId)
            for (let i=0; i<rentDetails.length(); i++){
                const query5 =`Select ownerId from dbo.car 
                                where id = @carId`
                const result5 =await poolConnection.request()
                .input("carId", sql.Int, rentDetails[i].carId)
                const car = result5.recordset[0]
                const title = "Lời yêu cầu thuê xe từ " + User.name
                const message = ""
                const senderId = User.id
                const receivedId = car.ownerId
                const dateUp = await Util.currentTime()
                const query6 = `Insert into dbo.notification (receivedId, title, message, dateUp, senderId)
                                values (@receivedId, @title, @message, @dateUp, @senderId)`
                await poolConnection.request()
                .input("receivedId", sql.Int, receivedId)
                .input("title", sql.NVarChar, title)
                .input("message", sql.NVarChar, message)
                .input("dateUp", sql.DateTime, dateUp)
                .input("senderId", sql.Int, senderId)
                .query(query6)
            }
            // gửi tiền cho admin 
            // + point
        }
    } catch (error) {
        
    }
}

const cancelRentDetail = async(rentDetailId)=>{
    // chuyển status
    // gửi notificate cho owner
    // hoàn tiền bao nhiêu %?
    // 
}


module.exports = {
    countRentalCar,
    statisticRentalByYear,
    addRentDetail,
    deleteRentDetail,
    confirmPayment,
    cancelRentDetail
}