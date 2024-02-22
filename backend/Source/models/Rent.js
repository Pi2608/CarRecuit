const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const Util = require("../Util/Util");
const voucher = require("./Voucher");
const car = require("./Car");
const user = require("./User");

const countRentalCar = async (carId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `SELECT COUNT(dbo.rentDetail.id) AS rentCount 
                        FROM dbo.rentDetail
                        INNER JOIN dbo.rent ON dbo.rent.id = dbo.rentDetail.rentId
                        WHERE dbo.rent.paymentId IS NOT NULL AND 
                              dbo.rentDetail.carId = @carId
                        GROUP BY dbo.rentDetail.carId`;
        const result = await poolConnection.request()
            .input('carId', sql.Int, carId)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const carRentalSchedule = async (carId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `SELECT pick_up, drop_off FROM dbo.rentDetail WHERE carId = @carId`;
        const result = await poolConnection.request()
            .input("carId", sql.Int, carId)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const statisticRental = async (year) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `SELECT 
                            YEAR(dbo.rent.time) AS year,
                            MONTH(dbo.rent.time) AS month,
                            DATEPART(week, dbo.rent.time) AS week,
                            COUNT(*) AS total
                        FROM dbo.rent
                        WHERE dbo.rent.paymentId IS NOT NULL AND
                            YEAR(dbo.rent.time) = @year
                        GROUP BY YEAR(dbo.rent.time), MONTH(dbo.rent.time), DATEPART(week, dbo.rent.time)
                        ORDER BY year, month, week`;
        const result = await poolConnection.request()
            .input('year', sql.Int, year)
            .query(query);
        return result.recordset;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const createRent = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const time = await Util.currentTime();
        const query = `INSERT INTO dbo.rent (userId, total, time)
                        VALUES (@userId, 0, @time)`;
        await poolConnection.request()
            .input('userId', sql.Int, userId)
            .input('time', sql.DateTime, time)
            .query(query);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getCurrentRent = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `SELECT MAX(id) AS id, total FROM dbo.rent
                        WHERE userId = @userId
                        AND paymentId IS NULL`;
        const result = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getRentDetailCurrent = async (userId) => {
    try {
        const rent = await getCurrentRent(userId);
        if (rent != null) {
            let poolConnection = await sql.connect(config);
            const query = `SELECT * FROM dbo.rentDetail
                            WHERE rentId = @rentId`;
            const result = await poolConnection.request()
                .input('rentId', sql.Int, rent.id)
                .query(query);
            return result.recordset;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addRentDetail = async (userId, carId, pick_up, drop_off, voucherCode) => {
    try {
        let rent = await getCurrentRent(userId);
        let poolConnection = await sql.connect(config);

        const timeBeforeRent = await Util.calculatePeriod(await Util.currentTime(), pick_up);
        const [dayLeft] = timeBeforeRent.split(":").map(Number);
        if (dayLeft < 3) {
            return {
                message: "Thời gian thuê phải sớm nhận xe 3 ngày"
            };
        }

        if (rent == null) {
            await createRent(userId);
            rent = await getCurrentRent(userId);
        }

        let voucherId = null;
        let voucherDiscount = 0;
        if (voucherCode != null) {
            const checkVoucher = await voucher.checkVoucher(voucherCode);
            if (checkVoucher.valid == true) {
                voucherId = checkVoucher.id;
                const Voucher = await voucher.getVoucherByCode(voucherCode);
                voucherDiscount = Voucher.discount;

                const addDate = await Util.currentTime();
                const voucherUserQuery = `INSERT INTO dbo.voucherUser (voucherId, userId, addDate)
                                            VALUES (@voucherId, @userId, @addDate)`;
                await poolConnection.request()
                    .input('voucherId', sql.Int, checkVoucher.id)
                    .input('userId', sql.Int, userId)
                    .input('addDate', sql.DateTime, addDate)
                    .query(voucherUserQuery);
            } else {
                return {
                    message: "Mã giảm giá không hợp lệ"
                };
            }
        }

        const carDetail = await car.getCarById(carId);
        const totalPrice = Util.calculatePrice(carDetail.price, pick_up, drop_off, voucherDiscount);

        const rentDetailQuery = `INSERT INTO dbo.rentDetail (rentId, carId, pick_up, drop_off, voucherId, totalPrice)
                                    VALUES (@rentId, @carId, @pick_up, @drop_off, @voucherId, @totalPrice)`;
        await poolConnection.request()
            .input('rentId', sql.Int, rent.id)
            .input('carId', sql.Int, carId)
            .input('pick_up', sql.DateTime, pick_up)
            .input('drop_off', sql.DateTime, drop_off)
            .input('voucherId', sql.Int, voucherId)
            .input('totalPrice', sql.Money, totalPrice)
            .query(rentDetailQuery);

        await car.decreaseCarQuantity(carId);

        return {
            message: "Thêm chi tiết thuê thành công"
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const getRentById = async (rentId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `SELECT * FROM dbo.rent WHERE id = @rentId`;
        const result = await poolConnection.request()
            .input('rentId', sql.Int, rentId)
            .query(query);
        return result.recordset[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateRentTotal = async (rentId, total) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `UPDATE dbo.rent SET total = @total WHERE id = @rentId`;
        await poolConnection.request()
            .input('total', sql.Money, total)
            .input('rentId', sql.Int, rentId)
            .query(query);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const confirmPayment = async (userId) => {
    try {
        const rent = await getCurrentRent(userId);
        let poolConnection = await sql.connect(config);
        const User = await user.getUserById(userId);

        if (User.wallet > rent.total) {
            let isDuplicated = true;
            let paymentCode;
            while (isDuplicated) {
                paymentCode = await Util.generateRandomString(10);
                const query1 = `SELECT * FROM dbo.payment WHERE paymentCode = @paymentCode`;
                const result1 = await poolConnection.request()
                    .input("paymentCode", sql.NVarChar, paymentCode)
                    .query(query1);
                const Payment = result1.recordset;
                if (Payment.length === 0) {
                    isDuplicated = false;
                }
            }
            const query2 = `INSERT INTO dbo.payment (paymentCode, paymentDate) VALUES (@paymentCode, @paymentDate)`;
            await poolConnection.request()
                .input("paymentCode", sql.NVarChar, paymentCode)
                .input("paymentDate", sql.NVarChar, Util.currentTime())
                .query(query2);

            const query3 = `UPDATE dbo.user SET wallet = wallet - @rentTotal WHERE id = @userId`;
            await poolConnection.request()
                .input("rentTotal", sql.Float, rent.total)
                .input("userId", sql.Int, userId)
                .query(query3);

            const query4 = `UPDATE dbo.rent SET paymentId = (SELECT id FROM dbo.payment WHERE paymentCode = @paymentCode) WHERE id = @rentId`;
            await poolConnection.request()
                .input("paymentCode", sql.NVarChar, paymentCode)
                .input("rentId", sql.Int, rent.id)
                .query(query4);

            const rentDetails = await getRentDetailCurrent(userId);
            for (let rentDetail of rentDetails) {
                const query5 = `SELECT ownerId FROM dbo.car WHERE id = @carId`;
                const result5 = await poolConnection.request()
                    .input("carId", sql.Int, rentDetail.carId)
                    .query(query5);
                const car = result5.recordset[0];
                const title = "Lời yêu cầu thuê xe từ " + User.name;
                const message = "";
                const senderId = User.id;
                const receivedId = car.ownerId;
                const dateUp = await Util.currentTime();
                const query6 = `INSERT INTO dbo.notification (receivedId, title, message, dateUp, senderId) VALUES (@receivedId, @title, @message, @dateUp, @senderId)`;
                await poolConnection.request()
                    .input("receivedId", sql.Int, receivedId)
                    .input("title", sql.NVarChar, title)
                    .input("message", sql.NVarChar, message)
                    .input("dateUp", sql.DateTime, dateUp)
                    .input("senderId", sql.Int, senderId)
                    .query(query6);

                const query7 = `UPDATE dbo.rentDetail SET notificationId = (SELECT MAX(id) FROM dbo.notification) WHERE id = @rentDetailId`;
                await poolConnection.request()
                    .input('rentDetailId', sql.Int, rentDetail.id)
                    .query(query7);
            }

            const extraPoint = Math.floor(rent.total / 1000);
            const query8 = `UPDATE dbo.user SET point = point + @extraPoint WHERE id = @userId`;
            await poolConnection.request()
                .input("extraPoint", sql.Int, extraPoint)
                .input("userId", sql.Int, userId)
                .query(query8);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const acceptRentDetail = async (notificationId, ownerId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query1 = `SELECT * FROM dbo.rentDetail WHERE notificationId = @notificationId`;
        const result1 = await poolConnection.request()
            .input('notificationId', sql.Int, notificationId)
            .query(query1);
        const rentDetail = result1.recordset[0];
        const query2 = `UPDATE dbo.rentDetail SET isAccepted = 1 WHERE id = @rentDetailId`;
        await poolConnection.request()
            .input('rentDetailId', rentDetail.id)
            .query(query2);
        const addWallet = rentDetail.total * 0.8;
        const query3 = `UPDATE dbo.user SET wallet = wallet + @addWallet WHERE id = @ownerId`;
        await poolConnection.request()
            .input('addWallet', sql.Float, addWallet)
            .input('ownerId', sql.Int, ownerId)
            .query(query3);

        const query4 = `SELECT * FROM dbo.rent WHERE id = @rentId`;
        const result4 = await poolConnection.request()
            .input("rentId", sql.Int, rentDetail.rentId)
            .query(query4);
        const rent = result4.recordset;
        let receivedId = rent.userId;
        let title = "";
        let message = "";
        let dateUp = await Util.currentTime();
        let senderId = ownerId;
        const query5 = `INSERT INTO dbo.notification (receivedId, senderId, title, message, dateUp) VALUES (@receivedId, @senderId, @title, @message, @dateUp)`;
        await poolConnection.request()
            .input("receivedId", sql.Int, receivedId)
            .input("senderId", sql.Int, senderId)
            .input("title", sql.NVarChar, title)
            .input("message", sql.NVarChar, message)
            .input("dateUp", sql.DateTime, dateUp)
            .query(query5);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
``


const cancelRent = async (rentId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `DELETE FROM dbo.rent WHERE id = @rentId`;
        await poolConnection.request()
            .input('rentId', sql.Int, rentId)
            .query(query);
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const cancelRentDetailByUser = async (rentDetailId, userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query1 = `UPDATE dbo.rentDetail SET isAccepted = 0 WHERE id = @rentDetailId`;
        await poolConnection.request()
            .input('rentDetailId', sql.Int, rentDetailId)
            .query(query1);

        const query3 = `SELECT * FROM dbo.rentDetail WHERE id = @rentDetailId`;
        const result3 = await poolConnection.request()
            .input('rentDetailId', sql.Int, rentDetailId)
            .query(query3);
        const rentDetail = result3.recordset[0];

        // Calculate refund based on period
        let refund = 0;
        const period = await Util.calculatePeriod(await Util.currentTime(), rentDetail.pick_up);
        const [dayLeft, , ,] = period.split(":").map(Number);
        if (dayLeft >= 7) {
            refund = rentDetail.total;
        } else if (dayLeft < 7 && dayLeft >= 1) {
            refund = rentDetail.total * 0.7;
        }

        if (refund > 0) {
            const query4 = `UPDATE dbo.user SET wallet = wallet + @refund WHERE id = @userId`;
            await poolConnection.request()
                .input("userId", sql.Int, userId)
                .input("refund", sql.Money, refund)
                .query(query4);

            // Send notification to user
            const notificationQuery = `INSERT INTO dbo.notification (receivedId, senderId, title, message, dateUp) VALUES (@userId, 1, '', '', GETDATE())`;
            await poolConnection.request()
                .input("userId", sql.Int, userId)
                .query(notificationQuery);
        }

        // Send notification to owner
        const query6 = `SELECT ownerId FROM dbo.car WHERE id = @carId`;
        const result6 = await poolConnection.request()
            .input("carId", sql.NVarChar, rentDetail.carId)
            .query(query6);
        const car = result6.recordset[0];
        const query7 = `INSERT INTO dbo.notification (receivedId, senderId, title, message, dateUp) VALUES (@ownerId, @userId, '', '', GETDATE())`;
        await poolConnection.request()
            .input("ownerId", sql.Int, car.ownerId)
            .input("userId", sql.Int, userId)
            .query(query7);

        // Deduct points from user
        const minusPoint = Math.floor();
        const query8 = `UPDATE dbo.user SET point = point - @minusPoint WHERE id = @userId`;
        await poolConnection.request()
            .input("minusPoint", sql.Int, minusPoint)
            .input("userId", sql.Int, userId)
            .query(query8);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const cancelRentDetailByOwner = async (notificationId, ownerId) => {
    try {
        let poolConnection = await sql.connect(config);

        // Get rentDetail and cancel it
        const query1 = `SELECT * FROM dbo.rentDetail WHERE notificationId = @notificationId`;
        const result1 = await poolConnection.request()
            .input('notificationId', sql.Int, notificationId)
            .query(query1);
        const rentDetail = result1.recordset[0];
        const query2 = `UPDATE dbo.rentDetail SET isAccepted = 0 WHERE id = @rentDetailId`;
        await poolConnection.request()
            .input('rentDetailId', rentDetail.id)
            .query(query2);

        // Refund to user
        const query3 = `UPDATE dbo.user SET wallet = wallet + @refund WHERE id = (SELECT userId FROM dbo.rent WHERE id = @rentId)`;
        await poolConnection.request()
            .input('refund', sql.Float, rentDetail.total)
            .input('rentId', sql.Int, rentDetail.rentId)
            .query(query3);

        // Send notification to user
        const query4 = `INSERT INTO dbo.notification (receivedId, senderId, title, message, dateUp) VALUES ((SELECT userId FROM dbo.rent WHERE id = @rentId), @ownerId, '', '', GETDATE())`;
        await poolConnection.request()
            .input("rentId", sql.Int, rentDetail.rentId)
            .input("ownerId", sql.Int, ownerId)
            .query(query4);
    } catch (error) {
        console.error(error);
        throw error;
    }
};


module.exports = {
    countRentalCar,
    carRentalSchedule,
    statisticRental,
    createRent,
    getCurrentRent,
    getRentDetailCurrent,
    addRentDetail,
    cancelRent,
    cancelRentDetailByOwner,
    cancelRentDetailByUser,
    getRentById,
    updateRentTotal,
    confirmPayment,
    acceptRentDetail,
}
