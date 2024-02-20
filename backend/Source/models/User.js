const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const util = require("../Util/Util");
var jwt = require('jsonwebtoken');


const getAllUser = async()=>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'SELECT * FROM [dbo].[user]';
        const result = await poolConnection.request().query(query);
        return result.recordset;
    }catch(err){
        console.log(err);
    }
}

const getUserIdByEmail= async(email) => {
    try{
        let poolConnection = await sql.connect(config);
        const query = 'Select id From [dbo].[user] where email=@Email';
        const result = await poolConnection.request()
        .input('Email', sql.NVarChar, email)
        .query(query);
        return result.recordset[0];
    }catch(err){
        console.log(err);
    }
}

const getUserById= async(id) => {
    try{
        let poolConnection = await sql.connect(config);
        const query = 'Select * From [dbo].[user] where id =@id';
        const result = await poolConnection.request()
        .input('id', sql.Int, id)
        .query(query);
        return result.recordset[0];
    }catch(err){
        console.log(err);
    }
}


const createUser = async (email, password)=>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'INSERT INTO [dbo].[user] (roleID, email, password, status, wallet) VALUES (1, @Email, @Password, true, 0)';
        await poolConnection.request()
        .input('Email', sql.NVarChar, email)
        .input('Password', sql.NVarChar, password)
        .query(query);
        const query2 = 'Insert Into [dbo].[MemberShipUser] (userId, memberShipId, timeChanged) VALUES (@UserId, @MemberShipId, @TimeChanged)'
        await poolConnection.request()
        .input('UserId', sql.Int, getUserIdByEmail(email))
        .input('MemberShipId', sql.Int, 1)
        .input(timeChanged, sql.DateTime, util.currentTime)
        .query(query2);
    }catch(err){
        console.log(err);
    }
}



const updateUser = async (name, phone, dateOfBirth, NID, NIDName, NIDBirth, NIDNative, NIDAddress, NIDDate, NIDProvided, NDL, NDLName, NDLBirth, email, FNIDimg, BNIDimg, FNDLimg)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 ="Insert into dbo.NID (NID, name, birth, native, address, date, provided, isConfirm)"
        const userId = (await getUserIdByEmail(email)).id
        addKindImgUser('FNID',FNIDimg, userId);
        addKindImgUser('BNID',BNIDimg, userId);
        addKindImgUser('FNDL',FNDLimg, userId);
    }catch(err){
        console.log(err);
    }
}

const addKindImgUser = async (message, imageUrl, userId) => {
    try {
        let idImg = '';
        if (message === 'FNID') {
            idImg = 'FNID' + userId;
        }
        if (message === 'BNID') {
            idImg = 'BNID' + userId;
        }
        if (message === 'FNDL') {
            idImg = 'FNDL' + userId;
        }

        const images = await getImgsUserById(userId);
        const img = images.find(img => img.id === idImg);

        let poolConnection = await sql.connect(config);
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


const deleteUserById = async (userId) =>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'Update [dbo].[user] Set isDeleted = 1 Where id=@userId';
        await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query);
    }catch(err){

    }
}

const replyFeedback = async (userId, carId, message, rating)=>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'INSERT INTO [dbo].[feedback] (userId, carId, message, rating, feedbackDate) Values (@UserId, @CarId, @Message, @Rating, @FeedbackDate)';
        await poolConnection.request()
        .input('UserId', sql.Int, userId)
        .input('CarId', sql.Int, carId)
        .input('Message', sql.NVarChar, message)
        .input('Rating', sql.Int, rating)
        .input('FeedbackDate', sql.DateTime, util.currentTime)
        .query(query);
    }catch(err){

    }
}
const editStatusUser = async (userId, status) =>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'Update [dbo].[user] Set status =@Status Where userId = @UserId'
        await poolConnection.request()
        .input('Status',sql.Bit, status)
        .input('UserId',sql.Int,userId)
        .query(query)
    }catch(err){

    }
}
const getNotification = async (userId) => {
    try{
        let poolConnection = await sql.connect(config);
        const query = 'SELECT * FROM [dbo].[notification] Where userId = @UserId'
        const result = await poolConnection.request()
        .input('UserId',sql.Int,userId)
        .query(query)
        return result.recordset;
    }catch(err){

    }
}

const sendNotification = async (userId, title, message, dateUp, senderId) =>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'Insert to [dbo].[notification] (userId, title, message, dateUp, senderId) Values (@UserId, @Title, @Message, @DateUp, @SenderId))'
        await poolConnection.request()
        .input('UserId',sql.Int,userId)
        .input('Title',sql.NVarChar, title)
        .input('Message', sql.NVarChar, message)
        .input('DateUp', sql.DateTime, dateUp)
        .input('SenderId', sql.Int, senderId)
        .query(query)
    }catch(err){
        
    }
}


const autoPromotedMembership = async (userId)=>{
    try{
            const userPoint = (await getUserById(userId)).point
            const memberShipId = (await getMemberShipUserCurrent(userId)).memberShipId;
            const newMemberShipId = memberShipId+1;
            let poolConnection = await sql.connect(config)
            const query1 ='Select pointRequire From [dbo].[memberShip] where id = %id'
            const result = await poolConnection.request()
            .input('id', sql.Int, newMemberShipId)
            .query(query1)
            const pointRequire = result.recordset.pointRequire
            if(userPoint>=pointRequire){
                const query2 = 'Insert into [dbo].[memberShipUser] (userId, memberShipId, timeChanged) Values (@UserId, @MemberShipId, @TimeChanged)'
                await poolConnection.request()
                .input('UserId', sql.Int, userId)
                .input('MemberShipId', sql.Int, newMemberShipId)
                .input('TimeChanged', sql.DateTime, util.currentTime)
                .query(query2)
            }
    }catch(err){
        console.log(err)
    }
}


const getMemberShipUserCurrent = async(userId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'SELECT * FROM [dbo].[memberShipUser] WHERE userId = @UserId AND id = (SELECT MAX(id) FROM [dbo].[memberShipUser] WHERE userId = @UserId)'
        const result = await poolConnection.request()
        .input('UserId', sql.Int, userId)
        .query(query)
        if (result.recordset.length > 0) {
            return result.recordset[0];
        } else {
            return null;
        }
    }catch(err){
        
    }
}

const checkLogin = async (email, password)=>{
    try{
        const users = await getAllUser()
        const user = users.find(user => user.email==email&& user.password==password)
        if (user != null && user.status == 1 && user.idDeleted == 0){
            const payload ={userid: user.id, email: user.email};
            const secretKey = 'carFlex2024'
            const token = jwt.sign(payload, secretKey)
            return {
                message: 'Đăng Nhập thành công',
                token: token
            }
        }else{
            return {
                message: 'Đăng Nhập thất bại',
            }
        }
    }catch(err){
        console.log("error: ",err)
    }
}

const createTransaction = async(userId, time, money, payerCode, currency, pointGet, paymentMethod)=>{
    try {
        let poolConnection = await sql.connect(config);
        const query = "Insert into [dbo].[transaction] (userId, time, money, payerCode, currency, pointGet, paymentMethod) values (@userId, @time, @money, @payerCode, @currency, @pointGet, @paymentMethod)"
        await poolConnection.request()
        .input('userId', sql.Int, userId)
        .input('time', sql.DateTime, time)
        .input('money', sql.Float, money)
        .input('payerCode', sql.NVarChar, payerCode)
        .input('currency', sql.NVarChar, currency)
        .input('pointGet', sql.Int, pointGet)
        .input('paymentMethod', sql.NVarChar, paymentMethod)
        .query(query)
    } catch (error) {
        console.log("Error: ", error)
    }
}

const getTransactionHistory = async(userId)=>{
    try {
        let poolConnection = await sql.connect(config);
        const query = "Select * From [dbo].[transaction] where userId = @userId"
        const result = await poolConnection.request()
        .input('userId', sql.Int, userId)
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const confirmNID = async (userId)=>{
    // chuyển status
    try {
        let poolConnection = await sql.connect(config)
        const query = `Update dbo.NID set isConfirm =1
                    where id = (select NIDId 
                    from dbo.user where id = @userId) `
        await poolConnection.request()
        .input("userId", sql.Int, userId)
        .query(query)
    } catch (error) {
        
    }
}
const confirmNDL = async (userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Update dbo.NDL set isConfirm =1
                        where id = (select NDLId 
                        from dbo.user where id = @userId)`
        await poolConnection.connect()
        .input("userId", sql.Int, userId)
        .query(query)
    } catch (error) {
        
    }
}

module.exports={
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
    replyFeedback,
    editStatusUser,
    getNotification,
    sendNotification,
    autoPromotedMembership,
    getMemberShipUserCurrent,
    checkLogin,
    getImgsUserById,
    createTransaction,
    getTransactionHistory
}

