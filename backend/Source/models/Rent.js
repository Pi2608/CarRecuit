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

const carRentalSchedule = async(carId)=>{
    // thêm điều kiện gì không ?
    try {
        let poolConnection = await sql.connect(config)
        const query ='Select pick_up, drop_off from dbo.rentDetail where carId = @carId'
        const result = await poolConnection.request()
        .input("carId", sql.Int, carId)
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
        const timeBeforeRent = await Util.calculatePeriod(await Util.currentTime, pick_up)
        const [dayLeft, hourLeft, minuteLeft, secondLeft] = timeBeforeRent.split(":").map(Number)
        if (dayLeft<3){
            return {
                message: "thời gian thuê phải sớm nhận xe 3 ngày"
            }
        }
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
        let rentalDay
        const [rentDay, rentHour, rentMinute, rentSecond] = (await Util.calculatePeriod(pick_up, drop_off)).split(":").map(Number)
        if(rentHour >=1){
            rentalDay = rentDay+1
        }else{
            rentalDay = rentDay
        }        
        const Car = await car.getCarById(carId)
        const discountCar = Car.discount
        const priceCar = Car.price
        const final = priceCar*(1-discountCar)*(1-voucherDiscount)*rentalDay
        
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
    //tạo mã paymentCode
    //tạo payment
    //trừ tiền
    //gán payment vào rent
    //gửi thông báo đến owner
    // gán notificationId vào rentDetail
    // + point
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
                .query(query5)
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
                const query7 =`Update dbo.rentDetail 
                            set notificationId = (Select Max(id) from db.notification) 
                            where id =@rentDetailId`
                await poolConnection.request()
                .input('rentDetailId', sql.Int, rentDetails[i].id)
                .query(query7)
            }
            //+point
            const extraPoint = Math.floor(rent.total/1000);
            const query8 =`Update dbo.user set point = point + @extraPoint
                        where id = @userId`
            await poolConnection.request()
            .input("extraPoint", sql.Int , extraPoint)
            .input("userId", sql.Int, userId)
            .query(query8)
        }
    } catch (error) {
        
    }
}
const acceptRentDetail = async(notificationId, ownerId)=>{
    //chuyển status
    //thêm tiền vào ví của chủ xe
    //gửi notification cho người thuê
    try {
        let poolConnection =  await sql.connect(config)
        const query1 = `Select * from dbo.rentDetail 
                        where notificationId = @notificationId`
        const result1 = await poolConnection.request()
        .input('notificationId', sql.Int, notificationId)
        .query(query1)
        const rentDetail = result1.recordset[0]
        const query2 = `Update from dbo.rentDetail set isAccepted = 1
                        where id =@rentDetailId`
        await poolConnection.request()
        .input('rentDetailId', rentDetail.id)
        .query(query2)
        const addWallet = rentDetail.total*0.8
        const query3=`Update from dbo.user 
                    set wallet = wallet + @addWallet
                    where id = @ownerId`
        await poolConnection.request()
        .input('addWallet', sql.Float, addWallet)
        .input('ownerId', sql.Int, ownerId)
        .query(query3)
        const query4 = `Select * from dbo.rent 
                        where id = @rentId`
        const result4 = await poolConnection.request()
        .input("rentId", sql.Int, rentDetail.rentId)
        .query(query4)
        const rent = result4.recordset
        let receivedId = rent.userId
        let title = ""
        let message ="" 
        let dateUp = await Util.currentTime()
        let senderId = ownerId
        const query5=`Insert into dbo.notification (receivedId, senderId, title, message, dateUp)
                        values(@receivedId, @senderId, @title, @message, @dateUp)`
        await poolConnection.request()
        .input("receivedId", sql.Int, receivedId)
        .input("senderId", sql.Int, senderId)
        .input("title", sql.NVarChar, title)
        .input("message", sql.NVarChar, message)
        .input("dateUp", sql.DateTime, dateUp)
        .query(query5)
    } catch (error) {
        
    }
}

const cancelRentDetailByUser = async(rentDetailId, userId)=>{
    // chuyển status
    // gửi notificate cho owner và user
    // hoàn tiền cho user
    //-point
    try {
        let poolConnection =  await sql.connect(config)
        const query1 = `Update from dbo.rentDetail set isAccepted = 0
                        where id =@rentDetailId`
        await poolConnection.request()
        .input('rentDetailId', rentDetailId)
        .query(query1)
        
        const query3 = `Select * from dbo.rentDetail 
                        where id = rentDetailId`
        const result3 = await poolConnection.request()
        .input('rentDetailId', sql.Int, rentDetailId)
        .query(query3)
        const rentDetail = result3.recordset[0]
        const [dayLeft, hourLeft, minuteLeft, secondLeft] = (await Util.calculatePeriod(await Util.currentTime(), rentDetail.pick_up)).split(":").map(Number)
        if(dayLeft>=7){
            refund = rentDetail.total*1
        }
        else if(dayLeft<7&& dayLeft>=1){
            refund = rentDetail.total*0.7
        }else{
            refund = rentDetail.total*0
        }
        let receivedId
        let title
        let message 
        let dateUp
        let senderId
        if (refund>0){
            const query4 =`Update dbo.user set wallet = wallet + @refund
                            where id = @userId`
            await poolConnection.request()
            .input("userId", sql.Int, userId)
            .query(query4)
            receivedId = userId
            title = ""
            message = "" 
            dateUp =await Util.currentTime()
            senderId = 1
            const query5 = `Insert into dbo.notification (receivedId, senderId, title, message, dateUp)
                            values(@receivedId, @senderId, @title, @message, @dateUp)`
            await poolConnection.request()
            .input("receivedId", sql.Int, receivedId)
            .input("senderId", sql.Int, senderId)
            .input("title", sql.NVarChar, title)
            .input("message", sql.NVarChar, message)
            .input("dateUp", sql.DateTime, dateUp)
            .query(query5)
        }
        const query6 = `Select ownerId from dbo.car 
                        where id = @carId`
        const result6 =await poolConnection.request()
        .input("carId", sql.NVarChar, rentDetail.carId)
        .query(query6)
        const car = result6.recordset[0]
        receivedId = car.ownerId
        title=""
        message=""
        senderId = userId
        const query7 =`Insert into dbo.notification (receivedId, senderId, title, message, dateUp)
                        values(@receivedId, @senderId, @title, @message, @dateUp)`
        await poolConnection.request()
        .input("receivedId", sql.Int, receivedId)
        .input("senderId", sql.Int, senderId)
        .input("title", sql.NVarChar, title)
        .input("message", sql.NVarChar, message)
        .input("dateUp", sql.DateTime, dateUp)
        .query(query7)
        const minusPoint = Math.floor();
        const query8 = `Update dbo.user set point = point - @minusPoint
                        where id = @userId`
        await poolConnection.request()
        .input("minusPoint", sql.Int, minusPoint)
        .input("userId", sql.Int, userId)
        .query(query8)   
    } catch (error) {
        
    }
}
const cancelRentDetailByOwner = async(notificationId, ownerId)=>{
    // chuyển status
    // refund tiền cho user
    // gửi thông báo
    try {
        let poolConnection =  await sql.connect(config)
        const query1 = `Select * from dbo.rentDetail 
                        where notificationId = @notificationId`
        const result1 = await poolConnection.request()
        .input('notificationId', sql.Int, notificationId)
        .query(query1)
        const rentDetail = result1.recordset[0]
        const query2 = `Update from dbo.rentDetail set isAccepted = 0
                        where id =@rentDetailId`
        await poolConnection.request()
        .input('rentDetailId', rentDetail.id)
        .query(query2)
        let refund = rentDetail.total
        const query3=`Update from dbo.user 
                    set wallet = wallet + @refund
                    where id = (Select userId from dbo.rent where id=@rentId)`
        await poolConnection.request()
        .input('refund', sql.Float, refund)
        .input('rentId', sql.Int, rentDetail.rentId)
        .query(query3)
        const query4 = `Select * from dbo.rent 
                        where id = @rentId`
        const result4 = await poolConnection.request()
        .input("rentId", sql.Int, rentDetail.rentId)
        .query(query4)
        const rent = result4.recordset
        let receivedId = rent.userId
        let title = ""
        let message ="" 
        let dateUp = await Util.currentTime()
        let senderId = ownerId
        const query5=`Insert into dbo.notification (receivedId, senderId, title, message, dateUp)
                        values(@receivedId, @senderId, @title, @message, @dateUp)`
        await poolConnection.request()
        .input("receivedId", sql.Int, receivedId)
        .input("senderId", sql.Int, senderId)
        .input("title", sql.NVarChar, title)
        .input("message", sql.NVarChar, message)
        .input("dateUp", sql.DateTime, dateUp)
        .query(query5)
    } catch (error) {
        
    }
}


module.exports = {
    countRentalCar,
    carRentalSchedule,
    statisticRentalByYear,
    addRentDetail,
    deleteRentDetail,
    confirmPayment,
    acceptRentDetail,
    cancelRentDetailByUser,
    cancelRentDetailByOwner
}