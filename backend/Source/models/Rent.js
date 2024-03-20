const sql = require('mssql');
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
                            dbo.rentDetail.carId`
        const result = await poolConnection.request()
        .input('carId', sql.Int, carId)
        .query(query)
        if (result.recordset[0]==null){
            return 0;
        }else{
            return result.recordset[0]
        }
    } catch (error) {
        console.log(error)
    }
}

const carRentalSchedule = async(carId)=>{
    // thêm điều kiện gì không ?
    try {
        let poolConnection = await sql.connect(config)
        const query ='Select pick_up, drop_off from dbo.rentDetail where carId = @carId and isAccepted = 1'
        const result = await poolConnection.request()
        .input("carId", sql.Int, carId)
        .query(query)
        const schedules = result.recordset
        let returnResult = []
        const currentTime =await Util.currentTime()
        for(const schedule of schedules){
            if(await Util.compareDates(currentTime, schedule.drop_off)){
                returnResult.push(schedule)
            }
        }
        return returnResult
    } catch (error) {
        console.log(error)
    }
}

const statisticRentalByYear = async (year) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `SELECT 
                            YEAR(dbo.rent.time) as year,
                            MONTH(dbo.rent.time) as month,
                            ISNULL(COUNT(*), 0) as total
                        FROM
                            dbo.rent
                        INNER JOIN
                            dbo.rentDetail
                        ON
                            rentDetail.rentId = rent.id
                        WHERE
                            dbo.rent.paymentId IS NOT NULL AND
                            YEAR(dbo.rent.time) = @year
                        GROUP BY
                            YEAR(dbo.rent.time), MONTH(dbo.rent.time)
                        ORDER BY
                            year, month`;
        const result = await poolConnection.request()
            .input('year', sql.Int, year)
            .query(query);
        
        // Creating an object to store rental statistics for each month
        const rentalStats = {
            T1: 0, T2: 0, T3: 0, T4: 0, T5: 0, T6: 0,
            T7: 0, T8: 0, T9: 0, T10: 0, T11: 0, T12: 0
        };

        // Populating rental statistics object with fetched data
        result.recordset.forEach(row => {
            rentalStats[`T${row.month}`] = row.total || 0;
        });

        return rentalStats;
    } catch (error) {
        console.log(error);
    }
};

const statisticRentalByMonthYear = async (month,year)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = `SELECT 
                            YEAR(dbo.rent.time) as year,
                            MONTH(dbo.rent.time) as month,
                            COUNT(*) as total
                        From
                            dbo.rent
                        Inner join
                            dbo.rentDetail
                        On
                            rentDetail.rentId=rent.id
                        Where
                            dbo.rent.paymentId is not null AND
                            YEAR(dbo.rent.time) = @year AND
                            MONTH(dbo.rent.time) = @month
                        Group By
                            YEAR(dbo.rent.time), MONTH(dbo.rent.time)
                        Order By
                            year, month`
        const result = await poolConnection.request()
        .input('year', sql.Int, year)
        .input('month', sql.Int, month)
        .query(query)
        return result.recordset[0]
    }catch(error){
        console.log(error)
    }
}

const statisticRentalThisMonth = async()=>{
    const current = new Date (await Util.currentTime())
    const thisMonth = current.getMonth()+1
    const thisYear = current.getFullYear()
    const statistic = await statisticRentalByMonthYear(thisMonth, thisYear)
    const statisticBefore = await statisticRentalByMonthYear(thisMonth-1, thisYear)
    if(statisticBefore != null && statistic !=null){
        statistic.diff = (statistic.total-statisticBefore.total)/statisticBefore.total
    }
    return statistic
}

const statisticEarningByMonthYear = async(month, year)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `Select 
                            YEAR(payment.paymentDate) as year,
                            MONTH(payment.paymentDate) as month,
                            (Sum(rent.total) - (Select 
                                                Sum(refund.total)
                                                From  dbo.payment
                                                Inner join dbo.refund
                                                on refund.paymentId = payment.id
                                                where YEAR(payment.paymentDate) = @year AND
                                                        MONTH(payment.paymentDate) = @month
                                                Group By
                                                YEAR(payment.paymentDate), MONTH(payment.paymentDate)))*0.2 as earning
                        From  dbo.payment
                        Inner join dbo.rent
                        on rent.paymentId = payment.id
                        where YEAR(payment.paymentDate) = @year AND
                                MONTH(payment.paymentDate) = @month
                        Group By
                            YEAR(payment.paymentDate), MONTH(payment.paymentDate)
                        Order By
                            year, month`
        const result1 = await poolConnection.request()
        .input('year', sql.Int, year)
        .input('month', sql.Int, month)
        .query(query1)
        return result1.recordset[0]
    } catch (error) {
        console.log(error)
    }
}

const statisticEarningByDayMonthYear= async(day, month, year)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `Select						
                            DAY (dbo.payment.paymentDate) as day,
                            YEAR(payment.paymentDate) as year,
                            MONTH(payment.paymentDate) as month,
                            (Sum(rent.total)-IsNull((Select 
                                                                        Sum(refund.total)
                                                                        From  dbo.payment
                                                                        Inner join dbo.refund
                                                                        on refund.paymentId = payment.id
                                                                        where DAY (payment.paymentDate) = 14 AND
                                                                        YEAR(payment.paymentDate) = 2024 AND
                                                                                MONTH(payment.paymentDate) = 3
                                                                        Group By
                                                                        YEAR(payment.paymentDate), MONTH(payment.paymentDate)),0))*0.2 as earning
                            From  dbo.payment
                            Inner join dbo.rent
                            on rent.paymentId = payment.id
                            where  DAY (payment.paymentDate) = 14 AND
                            YEAR(payment.paymentDate) = 2024 AND
                                    MONTH(payment.paymentDate) = 3
                            Group By
                                YEAR(payment.paymentDate), MONTH(payment.paymentDate), DAY (payment.paymentDate)
                            Order By
                                year, month , day`
        const result1 = await poolConnection.request()
        .input ('day', sql.Int, day)
        .input('year', sql.Int, year)
        .input('month', sql.Int, month)
        .query(query1)
        return result1.recordset[0]
    } catch (error) {
        console.log(error)
    }
}

const statisticEarningToday = async ()=>{
    const current = new Date (await Util.currentTime())
    const thisMonth = current.getMonth()+1
    const thisYear = current.getFullYear()
    const thisDay = current.getDate()-1
    console.log(thisDay, thisMonth, thisYear)
    const statistic = await statisticEarningByDayMonthYear(thisDay,thisMonth, thisYear)
    return statistic
}

const statisticEarningThisMonth = async()=>{
    const current = new Date (await Util.currentTime())
    const thisMonth = current.getMonth()+1
    const thisYear = current.getFullYear()
    const statistic = await statisticEarningByMonthYear(thisMonth, thisYear)
    const statisticBefore = await statisticEarningByMonthYear(thisMonth-1, thisYear)
    if(statisticBefore != null && statistic !=null){
        statistic.diff = (statistic.earning-statisticBefore.earning)/statisticBefore.earning
    }
    return statistic
}

const statisticEarningByYear = async (year) => {
    const earnings = {};
    for (let i = 1; i <= 12; i++) {
        const result = await statisticEarningByMonthYear(i, year);
        earnings[`T${i}`] = result ? result.earning : 0;
    }
    return earnings;
};

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
        console.log(error)   
    }
}

const getCurrentRent = async(userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `SELECT MAX(id) as id, total 
                        FROM [dbo].[rent] 
                        WHERE userId = @userId 
                        AND paymentId IS NULL
                        GROUP BY total`
        const result = await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query)
        return result.recordset[0]
    } catch (error) {
        console.log(error)
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
            return []
        }
    } catch (error) {
        console.log(error)
    }
}
const getRentAlreadyPayment = async (userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * from dbo.rent 
                        where userId = @userId
                        And paymentId IS NOT NULL`
        const result = await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query)
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}
const getRentDetailByRentId = async (rentId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * from dbo.rentDetail
                        where rentId = @rentId`
        const result = await poolConnection.request()
        .input('rentId', sql.Int, rentId)
        .query(query)
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}

const addRentDetail = async (userId, carId, pick_up, drop_off, voucherCode)=>{
    try {
        const NID = await user.getNIDinfoByUserId(userId)
        const NDL = await user.getNDLinfoByUserId(userId)
        if(NID[0].isConfirm == true && NDL[0].isConfirm == true){ // NID và NDL phải được xác minh
            let rent = await getCurrentRent(userId)
            let poolConnection = await sql.connect(config)
            const timeBeforeRent = await Util.calculatePeriod(await Util.currentTime(), await Util.inputDate(pick_up)) // khoảng thời gian giữa hiện tại và tg thuê
            const [dayLeft, hourLeft, minuteLeft, secondLeft] = timeBeforeRent.split(":").map(Number)
            if (dayLeft<3){// thời gian thuê phải ngắn hơn 3 ngày
                return {
                    message: "thời gian thuê phải sớm hơn ngày nhận xe 3 ngày"
                }
            }
            if(rent==null){ // chưa có rent thì tạo mới
                createRent(userId)
                rent = await getCurrentRent(userId)
            }

            let voucherId = null;
            let voucherDiscount = 0;
            if(!(voucherCode===undefined)){
                const checkVoucher = await voucher.checkVoucher(userId, voucherCode) // check voucher
                if(checkVoucher.valid == true){
                    voucherId = checkVoucher.id
                    const Voucher = await voucher.getVoucherByCode(voucherCode)
                    voucherDiscount = Voucher.discount
                    const addDate = await Util.currentTime()
                    const query1 =  `Insert into dbo.voucherUser (voucherId, userId, addDate)
                                values (@voucherId, @userId, @addDate)`
                    await poolConnection.request()
                    .input('voucherId', sql.Int, voucherId)
                    .input('userId', sql.Int, userId)
                    .input('addDate', sql.DateTime, addDate)
                    .query(query1)
                }else{
                    return {
                        message: checkVoucher.message
                    }
                }
            }
            const memberShip = await user.getMemberShipByUserId(userId) // lấy membership hiện tại
            let rentalDay
            const [rentDay, rentHour, rentMinute, rentSecond] = (await Util.calculatePeriod(pick_up, drop_off)).split(":").map(Number) // khoảng tg giữa ngày thuê và ngày trả
            if(rentHour >=1){
                rentalDay = rentDay+1
            }else{
                rentalDay = rentDay
            }  
            const Car = (await car.getCarById(carId))[0]
            const discountCar = Car.discount
            const priceCar = Car.price
            const final = priceCar*(1-memberShip.discount)*(1-discountCar)*(1-voucherDiscount)*rentalDay // tiền phải trả
            // thêm rentDetail
            const query2 =  `Insert into dbo.rentDetail (carId, pick_up, drop_off, rentId, voucherId, status, total)
                                values (@carId, @pick_up, @drop_off, @rentId, @voucherId, 0, @final)`
            await poolConnection.request()
            .input('carId', sql.Int, carId)
            .input('pick_up', sql.DateTime, await Util.inputDate(pick_up))
            .input('drop_off', sql.DateTime, await Util.inputDate(drop_off))
            .input('rentId', sql.Int, rent.id)
            .input('voucherId', sql.Int, voucherId)
            .input('final', sql.Float, final)
            .query(query2)
            // sủa tổng giá trên rent
            const query3 = `Update dbo.rent set total = total + @final
                            Where id = @id`
            await poolConnection.request()
            .input('final', sql.Float, final)
            .input('id', sql.Int, rent.id)
            .query(query3)
            return{
                message: "Thêm xe vào danh sách thuê"
            }
        }else{
            return {
                message: "Cần xác minh CMND và GPLX"
            }
        }
    } catch (error) {
        console.log(error)
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
        return{
            message: "xóa thành công"
        }
    } catch (error) {
        console.log(error)
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
        console.log(rent)
        let poolConnection = await sql.connect(config)
        const User = await user.getUserById(userId)
        const rentDetails = await getRentDetailCurrent(userId)

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
                const Payment = result1.recordset[0]
                if(Payment == null){
                    isDuplicated = false
                }
            }
            const query2 = `Insert into dbo.payment (paymentCode, paymentDate) 
                            values (@paymentCode, @paymentDate)`
            await poolConnection.request()
            .input("paymentCode", sql.NVarChar, paymentCode)
            .input("paymentDate", sql.DateTime,await Util.currentTime())
            .query(query2)
            
            const query3 = `Update [dbo].[user] set wallet = wallet - @rentTotal
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
            .query(query4)
            console.log(rentDetails.length)
            for (let i=0; i<rentDetails.length; i++){
                const query5 =`Select * from dbo.car 
                                where id = @carId`
                const result5 =await poolConnection.request()
                .input("carId", sql.Int, rentDetails[i].carId)
                .query(query5)
                const Car = result5.recordset[0]
                const title = "Lời yêu cầu thuê xe từ " + User.name
                const message = `Thuê chiếc xe `+ (await car.getCarTypeByTypeId(Car.carTypeId)).name+` vào ngày ` + rentDetails[i].pick_up
                +  ` và trả vào ngày ` + rentDetails[i].drop_off
                const senderId = User.id 
                const receivedId = Car.ownerId
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
                            set notificationId = (Select Max(id) from dbo.notification) 
                            where id =@rentDetailId`
                await poolConnection.request()
                .input('rentDetailId', sql.Int, rentDetails[i].id)
                .query(query7)
            }
            //+point
            const extraPoint = Math.floor(rent.total/2);
            const query8 =`Update [dbo].[user] set point = point + @extraPoint
                        where id = @userId`
            await poolConnection.request()
            .input("extraPoint", sql.Int , extraPoint)
            .input("userId", sql.Int, userId)
            .query(query8)
            // cập nhật lại memberShip
            await user.autoPromotedMembership(userId)
            return{
                message: "thanh toán thành công"
            }
        }else{
            return{
                message : "số dư trong ví không đủ"
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const acceptRentDetail = async(notificationId)=>{
    //chuyển status
    //thêm tiền vào ví của chủ xe
    //gửi notification cho người thuê
    try {
        let poolConnection =  await sql.connect(config)
        const query =  `Select * from dbo.notification where id = @notificationId`
        const result = await poolConnection.request()
        .input('notificationId', sql.Int, notificationId)
        .query(query)
        const ownerId = (result.recordset[0]).receivedId
        const query1 = `Select * from dbo.rentDetail 
                        where notificationId = @notificationId`
        const result1 = await poolConnection.request()
        .input('notificationId', sql.Int, notificationId)
        .query(query1)
        const rentDetail = result1.recordset[0]
        const query2 = `Update dbo.rentDetail set isAccepted = 1
                        where id =@rentDetailId`
        await poolConnection.request()
        .input('rentDetailId', rentDetail.id)
        .query(query2)
        const addWallet = rentDetail.total*0.8
        const query3=`Update [dbo].[user] 
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
        const rent = result4.recordset[0]
        let receivedId = rent.userId
        let title = "Chấp nhận yêu cầu từ chủ xe"
        let message ="Chiếc xe " +(await car.getCarTypeByTypeId((await car.getCarById(rentDetail.carId))[0].carTypeId)).name + " đã được chủ xe chấp nhận cho thuê vào ngày " + rentDetail.pick_up 
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
        return{
            message :"chấp nhận thành công"
        }
    } catch (error) {
        console.log(error)
    }
}

const cancelRentDetailByUser = async(rentDetailId, userId)=>{
    // chuyển status
    // gửi notificate cho owner và user
    // hoàn tiền cho user
    // - tiền trong ví của owner
    //-point
    try {
        let poolConnection =  await sql.connect(config)
        const query1 = `Update dbo.rentDetail set isAccepted = 0
                        where id =@rentDetailId`
        await poolConnection.request()
        .input('rentDetailId', rentDetailId)
        .query(query1)
        
        const query3 = `Select * from dbo.rentDetail 
                        where id = @rentDetailId`
        const result3 = await poolConnection.request()
        .input('rentDetailId', sql.Int, rentDetailId)
        .query(query3)
        const rentDetail = result3.recordset[0]
        const query7 = `Select ownerId from dbo.car 
                        where id = @carId`
        const result7 =await poolConnection.request()
        .input("carId", sql.Int, rentDetail.carId)
        .query(query7)
        const Car = result7.recordset[0]
        const [dayLeft, hourLeft, minuteLeft, secondLeft] = (await Util.calculatePeriod(await Util.currentTime(), rentDetail.pick_up)).split(":").map(Number)
        let refund
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
            const query4 =`Update [dbo].[user] set wallet = wallet + @refund
                            where id = @userId`
            await poolConnection.request()
            .input("refund", sql.Float, refund)
            .input("userId", sql.Int, userId)
            .query(query4)
            if (rentDetail.isAccepted == true){
                const query5 =`Update [dbo].[user] set wallet = wallet - @refund
                            where id = @ownerId`
                await poolConnection.request()
                .input("refund", sql.Float, refund*0.8)
                .input("ownerId", sql.Int, Car.ownerId)
                .query(query5)
            }
            receivedId = userId
            title = "Thông báo hoàn tiền"
            message = "Bạn đã được Hoàn lại " + refund + " vào trong ví" 
            dateUp =await Util.currentTime()
            const query6 = `Insert into dbo.notification (receivedId, title, message, dateUp)
                            values(@receivedId, @title, @message, @dateUp)`
            await poolConnection.request()
            .input("receivedId", sql.Int, receivedId)
            .input("title", sql.NVarChar, title)
            .input("message", sql.NVarChar, message)
            .input("dateUp", sql.DateTime, dateUp)
            .query(query6)
            const query10 = `Insert into dbo.refund (paymentId, rentDetailId, date, total)
                            values ((Select paymentId from dbo.rent where
                            id = (Select rentId from dbo.rentDetail where id = @rentDetailId)), @rentDetailId, @date, @total)`
            await poolConnection.request()
            .input('rentDetailId', sql.Int, rentDetailId)
            .input('date', sql.DateTime, await Util.currentTime())
            .input('total', sql.Float, refund)
            .query(query10)
        }
        receivedId = Car.ownerId
        title="Hủy chuyến xe từ " + (await user.getUserById(userId)).name
        message="Chuyến xe " + (await car.getCarTypeByTypeId((await car.getCarById(rentDetail.carId))[0].carTypeId)).name + " vào ngày " +  rentDetail.pick_up + " đã bị hủy."
        senderId = userId
        const query8 =`Insert into dbo.notification (receivedId, senderId, title, message, dateUp)
                        values(@receivedId, @senderId, @title, @message, @dateUp)`
        await poolConnection.request()
        .input("receivedId", sql.Int, receivedId)
        .input("senderId", sql.Int, senderId)
        .input("title", sql.NVarChar, title)
        .input("message", sql.NVarChar, message)
        .input("dateUp", sql.DateTime, dateUp)
        .query(query8)
        const minusPoint = Math.floor(rentDetail.total);
        const query9 = `Update [dbo].[user] set point = point - @minusPoint
                        where id = @userId`
        await poolConnection.request()
        .input("minusPoint", sql.Int, minusPoint)
        .input("userId", sql.Int, userId)
        .query(query9)
        await user.autoPromotedMembership(userId)
        return{
            message: "Hủy đơn thuê thành công"
        }   
    } catch (error) {
        console.log(error)
    }
}
const cancelRentDetailByOwner = async(notificationId)=>{
    // chuyển status
    // refund tiền cho user
    // gửi thông báo
    try {
        let poolConnection =  await sql.connect(config)
        const query =  `Select * from dbo.notification where id = @notificationId`
        const result = await poolConnection.request()
        .input('notificationId', sql.Int, notificationId)
        .query(query)
        const ownerId = (result.recordset[0]).receivedId
        const query1 = `Select * from dbo.rentDetail 
                        where notificationId = @notificationId`
        const result1 = await poolConnection.request()
        .input('notificationId', sql.Int, notificationId)
        .query(query1)
        const rentDetail = result1.recordset[0]
        const query2 = `Update dbo.rentDetail set isAccepted = 0
                        where id =@rentDetailId`
        await poolConnection.request()
        .input('rentDetailId', rentDetail.id)
        .query(query2)
        let refund = rentDetail.total
        const query3=`Update [dbo].[user] 
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
        const rent = result4.recordset[0]
        let receivedId = rent.userId
        let title = "Chủ xe đã từ chối cho thuê xe"
        let message ="Hủy thuê chuyến xe " + (await car.getCarTypeByTypeId((await car.getCarById(rentDetail.carId))[0].carTypeId)) + " vào ngày " + rentDetail.pick_up
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
        return{
            message: "Từ chối đơn hàng thành công"
        }
    } catch (error) {
        console.log(error)
    }
}

const currentTrip = async(userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS carName, rentDetail.pick_up, rentDetail.drop_off, [dbo].[user].name as owner, rentDetail.total, rentDetail.status, rentDetail.isAccepted
                        FROM dbo.car
                        Inner join dbo.rentDetail on rentDetail.carId = car.id
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id
                        inner join dbo.rent on rentDetail.rentId = rent.id
                        Inner join [dbo].[user] on rent.userId = [dbo].[user].id
                        WHERE rentDetail.drop_off > GETDATE() and [dbo].[user].id =@userId`
        const result1= await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query1)
        return result1.recordset
    } catch (error) {
        
    }
}
const historyTrip = async(userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS carName, rentDetail.pick_up, rentDetail.drop_off, [dbo].[user].name as owner, rentDetail.total, rentDetail.status, rentDetail.isAccepted
                        FROM dbo.car
                        Inner join dbo.rentDetail on rentDetail.carId = car.id
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id
                        inner join dbo.rent on rentDetail.rentId = rent.id
                        Inner join [dbo].[user] on rent.userId = [dbo].[user].id
                        WHERE rentDetail.drop_off < GETDATE() and [dbo].[user].id =@userId`
        const result1 = await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query1)
        return result1.recordset
    } catch (error) {
        
    }
}

module.exports = {
    countRentalCar,
    carRentalSchedule,
    getRentDetailCurrent,
    statisticRentalByYear,
    addRentDetail,
    deleteRentDetail,
    confirmPayment,
    acceptRentDetail,
    cancelRentDetailByUser,
    cancelRentDetailByOwner,
    getRentAlreadyPayment,
    getRentDetailByRentId,
    statisticRentalByMonthYear,
    statisticRentalThisMonth,
    statisticEarningThisMonth,
    statisticEarningByYear,
    statisticEarningToday,
    currentTrip,
    historyTrip
}