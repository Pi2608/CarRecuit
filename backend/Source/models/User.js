const sql = require('mssql');
const config = require("../config/dbconfig");
const Car = require("./Car")
const util = require("../Util/Util");
var jwt = require('jsonwebtoken');


const getAllUser = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const query = 'SELECT * FROM [dbo].[user]';
        const result = await poolConnection.request().query(query);
        return result.recordset;
    } catch (err) {
        console.log(err);
    }
}

const getUserByEmail = async (email) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = 'Select * From [dbo].[user] where email=@Email';
        const result = await poolConnection.request()
            .input('Email', sql.NVarChar, email)
            .query(query);
        return result.recordset[0]
    } catch (err) {
        console.log(err);
    }
}

const getNIDinfoByUserId = async (userId) => {
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `Select * from dbo.NID 
                        where id = (Select NIDid from [dbo].[user] where id = @userId)`
        const result1 = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query1)
        const NID = result1.recordset[0]
        const query2 = `Select * from dbo.image where userId = @userId and id like '%NID%'`
        const result2 = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query2)
        const images = result2.recordset
        for (let i = 0; i < images.length; i++) {
            images[i].url = await util.decodeImage(images[i].url, images[i].id)
        }
        return [NID, images]
    } catch (error) {
        console.log(error)
    }
}

const getNDLinfoByUserId = async (userId) => {
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `Select * from dbo.NDL 
                        where id = (Select NDLid from [dbo].[user] where id = @userId)`
        const result1 = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query1)
        const NDL = result1.recordset[0]

        const query2 = `Select * from dbo.image where userId = @userId and id like '%NDL%'`
        const result2 = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query2)
        const images = result2.recordset
        for (let i = 0; i < images.length; i++) {
            images[i].url = await util.decodeImage(images[i].url, images[i].id)
        }
        return [NDL, images]
    } catch (error) {
        console.log(error)
    }
}

const getImageByUserId = async (userId) => {
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `Select * from dbo.image where userId = @userId`
        const result = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query1)
        return result.recordset
    } catch (error) {

    }
}

const getUserById = async (id) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = 'Select * From [dbo].[user] where id =@id';
        const result = await poolConnection.request()
            .input('id', sql.Int, id)
            .query(query);
        const user = result.recordset[0]
        const query1 = `Select * from [dbo].[image] where userId = @id and id like '%F%'`
        const result1 = await poolConnection.request()
            .input('id', sql.Int, id)
            .query(query1)
        const image = result1.recordset[0]
        if (image !== undefined) {
            user.imgUrl = await util.decodeImage(image.url, image.id)
        }
        return user
    } catch (err) {
        console.log(err);
    }
}


const createUser = async (email, password) => {
    try {
        let poolConnection = await sql.connect(config);
        const user = await getUserByEmail(email);
        if (user != null) {
            return {
                message: "Email này đã tồn tại"
            }
        }
        const query1 = `Insert into dbo.NID (NID, name, dateOfBirth, native, address, dateProvide, provider, isConfirm)
                        values (NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0)`
        await poolConnection.request()
            .query(query1)
        const query2 = `Insert into dbo.NDL (NDL, name, dateOfBirth, isConfirm)
                        values (NULL, NULL, NULL, 0)`
        await poolConnection.request()
            .query(query2)
        const query3 = `INSERT INTO [dbo].[user] (roleID, email, password, status, wallet, NIDId, NDLId, point, isDeleted)
                         VALUES (1, @Email, @Password, 1, 0,
                            (Select MAX(id) from dbo.NID),
                            (Select MAX(id) from dbo.NDL), 0, 0)`;
        await poolConnection.request()
            .input('Email', sql.NVarChar, email)
            .input('Password', sql.NVarChar, password)
            .query(query3);
        const query4 = 'Insert Into [dbo].[memberShipUser] (userId, memberShipId, timeChanged) VALUES (@UserId, @MemberShipId, @TimeChanged)'
        await poolConnection.request()
            .input('UserId', sql.Int, (await getUserByEmail(email)).id)
            .input('MemberShipId', sql.Int, 1)
            .input('TimeChanged', sql.DateTime, await util.currentTime())
            .query(query4);
        return {
            message: "Tạo tài khoản thành công"
        }
    } catch (err) {
        console.log(err);
    }
}

const changePassword = async (oldPass, newPass, userId) => {
    let poolConnection = await sql.connect(config)
    const query1 = `Select * from [dbo].[user] where id = @userId and password = @oldPass`
    const result1 = await poolConnection.request()
        .input('userId', sql.Int, userId)
        .input('oldPass', sql.NVarChar, oldPass)
        .query(query1)
    const user = result1.recordset[0]
    if (user != null) {
        const query2 = `Update [dbo].[user] set password = @newPass where id =@userId`
        await poolConnection.request()
            .input('userId', sql.Int, userId)
            .input('newPass', sql.NVarChar, newPass)
            .query(query2)
        return {
            message: "Đổi mật khẩu thành công"
        }
    } else {
        return {
            message: "Nhập sai mật khẩu cũ"
        }
    }
}

const updateUser = async (name, phone, dateOfBirth, gender, userId) => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Update [dbo].[user] 
                    set name=@name, phone=@phone, dateOfBirth= @dateOfBirth, gender= @gender
                    where id = @userId`
        await poolConnection.request()
            .input('name', sql.NVarChar, name)
            .input('phone', sql.NVarChar, phone)
            .input('dateOfBirth', sql.DateTime, await util.inputDate(dateOfBirth))
            .input('gender', sql.NVarChar, gender)
            .input('userId', sql.Int, userId)
            .query(query);
        return {
            message: "Cập nhật thông tin cá nhân thành công"
        }
    } catch (err) {
        console.log(err);
    }
}

const updateImageUser = async (userId, imgUrl) => {
    try {
        let poolConnection = await sql.connect(config);
        let imgId = 'F-' + userId
        const images = await getImageByUserId(userId);
        const img = images.find(img => img.id === imgId);
        if (img) {
            const query1 = `Update [dbo].[image] set url = @imgUrl where id = @imgId`
            await poolConnection.request()
                .input('imgUrl', sql.NVarChar, imgUrl)
                .input('imgId', sql.NVarChar, imgId)
                .query(query1)
        }
        else {
            const query2 = `Insert into [dbo].[image] (id, url, userId) values (@imgId, @imgUrl, @userId)`
            await poolConnection.request()
                .input('imgUrl', sql.NVarChar, imgUrl)
                .input('imgId', sql.NVarChar, imgId)
                .input('userId', sql.Int, userId)
                .query(query2)
        }
        return {
            message: "cập nhật ảnh thành công"
        }
    } catch (error) {
        console.log(error)
    }
}

const sendConfirmNID = async (userId, NID, name, dateOfBirth, native, address, dateProvide, provider, imgs) => {
    try {
        let poolConnection = await sql.connect(config)
        const user = await getUserById(userId)
        const query = `Update dbo.NID 
                        set NID = @NID, name = @name, dateOfBirth=@dateOfBirth,
                        native = @native, address = @address, dateProvide = @dateProvide, provider = @provider, 
                        isConfirm = null
                        where id = @NIDId`
        await poolConnection.request()
            .input('NID', sql.NVarChar, NID)
            .input('name', sql.NVarChar, name)
            .input('dateOfBirth', sql.DateTime, await util.inputDate(dateOfBirth))
            .input('native', sql.NVarChar, native)
            .input('address', sql.NVarChar, address)
            .input('dateProvide', sql.DateTime, await util.inputDate(dateProvide))
            .input('provider', sql.NVarChar, provider)
            .input('NIDId', sql.Int, user.NIDId)
            .query(query)
        addKindImgUser('NIDF', imgs[0], userId)
        addKindImgUser('NIDB', imgs[1], userId)
        return {
            message: "Gửi yêu cầu xác nhận thành công"
        }
    } catch (error) {

    }
}

const sendConfirmNDL = async (userId, NDL, name, dateOfBirth, imgbase64) => {
    try {
        let poolConnection = await sql.connect(config)
        const user = await getUserById(userId)
        const query = `Update dbo.NDL 
                        set NDL = @NDL, name = @name, dateOfBirth=@dateOfBirth,
                        isConfirm = null
                        where id = @NDLId`
        await poolConnection.request()
            .input('NDL', sql.NVarChar, NDL)
            .input('name', sql.NVarChar, name)
            .input('dateOfBirth', sql.DateTime, await util.inputDate(dateOfBirth))
            .input('NDLId', sql.Int, user.NDLId)
            .query(query)
        addKindImgUser('NDLF', imgbase64[0], userId)
        return {
            message: "Gửi yêu cầu xác nhận thành công"
        }
    } catch (error) {
        console.log(error)
    }
}

const addKindImgUser = async (message, imageUrl, userId) => {
    try {
        let poolConnection = await sql.connect(config);
        let idImg = '';
        if (message === 'NIDF') {
            idImg = 'NIDF' + userId;
        }
        if (message === 'NIDB') {
            idImg = 'NIDB' + userId;
        }
        if (message === 'NDLF') {
            idImg = 'NDLF' + userId;
        }

        const images = await getImageByUserId(userId);
        const img = images.find(img => img.id === idImg);

        let query = '';

        if (img) {
            query = 'UPDATE [dbo].[image] SET url = @ImageUrl WHERE id = @IdImage';
            await poolConnection.request()
                .input('ImageUrl', sql.NVarChar, imageUrl)
                .input('IdImage', sql.NVarChar, idImg)
                .query(query);
        } else {
            query = 'INSERT INTO [dbo].[image] (id, url, carId, userId) VALUES (@IdImage, @ImageUrl, null, @UserId)';
            await poolConnection.request()
                .input('ImageUrl', sql.NVarChar, imageUrl)
                .input('IdImage', sql.NVarChar, idImg)
                .input('UserId', sql.Int, userId)
                .query(query);
        }
    } catch (error) {
        console.log('Err: ', error);
    }
};


const deleteUserById = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = 'Update [dbo].[user] Set isDeleted = 1 Where id=@userId';
        await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query);
    } catch (err) {

    }
}

const replyFeedback = async (userId, rentDetailId , message, rating) => {
    try {

        let poolConnection = await sql.connect(config);
        const query4 = `Select carId from dbo.rentDetail where id = @rentDetailId`
        const result4 = await poolConnection.request()
        .input('rentDetailId', sql.Int, rentDetailId)
        .query(query4)
        const carId = result4.recordset[0].carId
        const query = 'INSERT INTO [dbo].[feedback] (userId, carId, message, rating, feedbackDate) Values (@UserId, @CarId, @Message, @Rating, @FeedbackDate)';
        await poolConnection.request()
            .input('UserId', sql.Int, userId)
            .input('CarId', sql.Int, carId)
            .input('Message', sql.NVarChar, message)
            .input('Rating', sql.Int, rating)
            .input('FeedbackDate', sql.DateTime, await util.currentTime())
            .query(query);
        const ratingCar = await Car.getCarRating(carId)
        const query2 = `Update dbo.car set rating = @rating where id =@carId`
        await poolConnection.request()
            .input('rating', sql.Float, ratingCar)
            .input('carId', sql.Int, carId)
            .query(query2)
        const query3 = `Update dbo.rentDetail set feedbackId = 
                        (Select Max(id) from dbo.feedback)
                        where id = @rentDetailId`
        await poolConnection.request()
        .input('rentDetailId', sql.Int, rentDetailId)
        .query(query3)
        return {
            message: "gửi Feedback thành công"
        }
    } catch (err) {
        console.log(err)
    }
}
const deleteFeedback = async (feebackId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `Delete from dbo.feedback where id =@feedbackId`
        await poolConnection.request()
            .input('feedbackId', sql.Int, feebackId)
            .query(query)
    } catch (error) {

    }
}
const editStatusUser = async (userId, status) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = 'Update [dbo].[user] Set status =@Status Where id = @UserId'
        await poolConnection.request()
            .input('Status', sql.Int, status)
            .input('UserId', sql.Int, userId)
            .query(query)
        return {
            message: "sửa status thành công"
        }
    } catch (err) {
        console.log(err)
    }
}
const getNotification = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = 'SELECT * FROM [dbo].[notification] Where receivedId = @UserId'
        const result = await poolConnection.request()
            .input('UserId', sql.Int, userId)
            .query(query)
        return result.recordset;
    } catch (err) {
        console.log(err)
    }
}

const sendNotification = async (receivedId, title, message, senderId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = 'Insert into [dbo].[notification] (receivedId, title, message, dateUp, senderId) Values (@receivedId, @Title, @Message, @DateUp, @SenderId)'
        await poolConnection.request()
            .input('receivedId', sql.Int, receivedId)
            .input('Title', sql.NVarChar, title)
            .input('Message', sql.NVarChar, message)
            .input('DateUp', sql.DateTime, await util.currentTime())
            .input('SenderId', sql.Int, senderId)
            .query(query)
        return {
            message: "gửi thông báo thành công"
        }
    } catch (err) {
        console.log(err)
    }
}


const autoPromotedMembership = async (userId) => {
    try {
        const userPoint = (await getUserById(userId)).point
        const memberShipId = (await getMemberShipUserCurrent(userId)).memberShipId;
        console.log("membershipId: "+ memberShipId)
        if(memberShipId<5){
            const newMemberShipId = memberShipId + 1;
            let poolConnection = await sql.connect(config)
            const query1 = 'Select pointRequire From [dbo].[memberShip] where id = @id'
            const result = await poolConnection.request()
                .input('id', sql.Int, newMemberShipId)
                .query(query1)
            const pointRequire = result.recordset[0].pointRequire
            if (userPoint >= pointRequire) {
                const query2 = 'Insert into [dbo].[memberShipUser] (userId, memberShipId, timeChanged) Values (@UserId, @MemberShipId, @TimeChanged)'
                await poolConnection.request()
                    .input('UserId', sql.Int, userId)
                    .input('MemberShipId', sql.Int, newMemberShipId)
                    .input('TimeChanged', sql.DateTime, await util.currentTime())
                    .query(query2)
                return {
                    message: "cập nhật thành công"
                }
            }
            return {
                message: "chưa đủ điểm"
            }
        }
    } catch (err) {
        console.log(err)
    }
}


const getMemberShipUserCurrent = async (userId) => {
    try {
        console.log(userId)
        let poolConnection = await sql.connect(config)
        const query = 'SELECT * FROM [dbo].[memberShipUser] WHERE userId = @UserId AND id = (SELECT MAX(id) FROM [dbo].[memberShipUser] WHERE userId = @UserId)'
        const result = await poolConnection.request()
            .input('UserId', sql.Int, userId)
            .query(query)
        if (result.recordset.length > 0) {
            console.log(result.recordset[0])
            return result.recordset[0];
        } else {
            return null;
        }
    } catch (err) {
        console.log(err)
    }
}

const getMemberShipByUserId = async (userId) => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * from [dbo].[memberShip] where id =@id`
        const result = await poolConnection.request()
            .input('id', sql.Int, (await getMemberShipUserCurrent(userId)).memberShipId)
            .query(query)
        return result.recordset[0]
    } catch (error) {
        console.log(error)
    }
}

const checkLogin = async (email, password) => {
    try {
        const users = await getAllUser()
        const userForgetPass = users.find(user => user.email == email && user.password != password)
        if (userForgetPass != null) {
            return{
                status : 2
            }
        }
        const user = users.find(user => user.email == email && user.password == password)
        if (user != null && user.status == 1 && user.idDeleted != true) {
            const payload = { userid: user.id, email: user.email, roleId: user.roleId };
            const secretKey = 'carFlex2024'
            const token = jwt.sign(payload, secretKey)
            return {
                status: 3,
                token: token
            }
        } else {
            return {
                status: 1,
            }
        }
    } catch (err) {
        console.log("error: ", err)
    }
}

const createTransaction = async (userId, money, payerCode, pointGet, paymentMethod) => {
    try {
        let poolConnection = await sql.connect(config);
        const query1 = "Insert into [dbo].[transaction] (userId, time, money, payerCode, pointGet, paymentMethod) values (@userId, @time, @money, @payerCode, @pointGet, @paymentMethod)"
        await poolConnection.request()
            .input('userId', sql.Int, userId)
            .input('time', sql.DateTime, await util.currentTime())
            .input('money', sql.Float, money)
            .input('payerCode', sql.NVarChar, payerCode)
            .input('pointGet', sql.Int, pointGet)
            .input('paymentMethod', sql.NVarChar, paymentMethod)
            .query(query1)
        const query2 = "Update [dbo].[user] set wallet = wallet + @pointGet where id = @userId"
        await poolConnection.request()
            .input('pointGet', sql.Int, pointGet)
            .input('userId', sql.Int, userId)
            .query(query2)
    } catch (error) {
        console.log("Error: ", error)
    }
}

const totalTransactionUser = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const query = `Select SUM(money) as total from [dbo].[transaction] where userId = @userId`
        const result = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query)
        const transaction = result.recordset[0]
        if (transaction.total == null) {
            return {
                total: 0
            };
        } else {
            return transaction
        }
    } catch (error) {
        console.log(error)
    }
}

const getTransactionHistory = async (userId) => {
    try {
        let poolConnection = await sql.connect(config);
        const user = await getUserById(userId)
        console.log(user)
        if (user.roleId != 3) {
            const query = "Select * From [dbo].[transaction] where userId = @userId"
            const result = await poolConnection.request()
                .input('userId', sql.Int, userId)
                .query(query)
            return result.recordset
        } else {
            const query = "Select * From [dbo].[transaction]"
            const result = await poolConnection.request()
                .query(query)
            return result.recordset
        }
    } catch (error) {
        console.log(error)
    }
}
const editStatusNID = async (NIDId, isConfirm) => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Update dbo.NID set isConfirm =@isConfirm
                    where id = @NIDId`
        await poolConnection.request()
            .input("isConfirm", sql.Int, isConfirm)
            .input("NIDId", sql.Int, NIDId)
            .query(query)
        return {
            message: "đổi status thành công"
        }
    } catch (error) {

    }
}


const editStatusNDL = async (NDLId, isConfirm) => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Update dbo.NDL set isConfirm = @isConfirm
                        where id = @NDLId`
        await poolConnection.request()
            .input("isConfirm", sql.Int, isConfirm)
            .input("NDLId", sql.Int, NDLId)
            .query(query)
        return {
            message: "đổi status thành công"
        }
    } catch (error) {
        console.log(error)
    }
}
const showRequestConfirmNID = async () => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * from dbo.NID where isConfirm is null`
        const result = await poolConnection.request()
            .query(query)
        const NIDs = result.recordset
        let NIDsReturn = []
        for (let NID of NIDs) {
            const query1 = `Select * from dbo.image where id like '%NID%'
                        and userId = (Select id from [dbo].[user] where NIDId = @NIDId)`
            const result1 = await poolConnection.request()
                .input('NIDId', sql.Int, NID.id)
                .query(query1)
            const imgs = result1.recordset
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].url = await util.decodeImage(imgs[i].url, imgs[i].id)
            }
            NID.imgs = imgs
            NIDsReturn.push(NID)
        }
        return NIDsReturn
    } catch (error) {
        console.log(error)
    }
}
const showRequestConfirmNDL = async () => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * from dbo.NDL where isConfirm is null`
        const result = await poolConnection.request()
            .query(query)
        const NDLs = result.recordset
        let NDLsReturn = []
        for (let NDL of NDLs) {
            const query1 = `Select * from dbo.image where id like '%NDL%'
                                    and userId = (Select id from [dbo].[user] where NDLId = @NDLId)`
            const result1 = await poolConnection.request()
                .input('NDLId', sql.Int, NDL.id)
                .query(query1)
            const imgs = result1.recordset
            for (let i = 0; i < imgs.length; i++) {
                imgs[i].url = await util.decodeImage(imgs[i].url, imgs[i].id)
            }
            NDL.imgs = imgs
            NDLsReturn.push(NDL)
        }
        return NDLsReturn
    } catch (error) {
        console.log(error)
    }
}
const registerByGg = async (email) => {
    try {
        const user = await getUserByEmail(email)
        if (user != null) {
            return await checkLogin(email, null)
        } else {
            return await createUser(email, null)
        }
    } catch (error) {
        console.log(error)
    }
}

const getUserByToken = async (token) => {
    try {
        return jwt.verify(token, 'carFlex2024')
    } catch (error) {

    }
}
const getRoleByUserId = async (userId) => {
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `Select * from dbo.role where id = (Select roleId from [dbo].[user]
                        where id = @userId)`
        const result = await poolConnection.request()
            .input('userId', sql.Int, userId)
            .query(query1)
        return result.recordset[0]
    } catch (error) {
        console.log(error)
    }
}
const getCountUser = async ()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select COUNT(*) as amount from [dbo].[user] where roleId = 1 and isDeleted = 0 and status =1`
        const result = await poolConnection.request()
        .query(query)
        return result.recordset[0]
    } catch (error) {
        
    }
}

const checkFeedback = async (userId)=>{
    try {
        let poolConnection =await sql.connect(config)
        const query = `SELECT rentDetail.id, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS carName, rentDetail.pick_up, rentDetail.drop_off, [dbo].[user].name as owner, rentDetail.total, rentDetail.status, carId
                        FROM dbo.car
                        Inner join dbo.rentDetail on rentDetail.carId = car.id
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id
                        inner join dbo.rent on rentDetail.rentId = rent.id
                        Inner join [dbo].[user] on rent.userId = [dbo].[user].id
                        WHERE rentDetail.drop_off < GETDATE() and rentDetail.isAccepted = 1 and [dbo].[user].id = @userId and rentDetail.feedbackId is NULL`
        const result = await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query)
        const rentDetails = result.recordset
        for(let rentDetail of rentDetails){
            const query2 = `Select * from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, rentDetail.carId)
            .query(query2)
            const img = result2.recordset[0]
            rentDetail.imgUrl = await util.decodeImage(img.url, img.id)
            rentDetail.message = rentDetail.status
        }
        return rentDetails
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getAllUser,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUserById,
    replyFeedback,
    editStatusUser,
    getNotification,
    sendNotification,
    autoPromotedMembership,
    checkLogin,
    createTransaction,
    getTransactionHistory,
    editStatusNDL,
    editStatusNID,
    sendConfirmNDL,
    sendConfirmNID,
    getNDLinfoByUserId,
    getNIDinfoByUserId,
    changePassword,
    getMemberShipByUserId,
    showRequestConfirmNID,
    showRequestConfirmNDL,
    registerByGg,
    getUserByToken,
    getRoleByUserId,
    updateImageUser,
    totalTransactionUser,
    getCountUser,
    checkFeedback
}

