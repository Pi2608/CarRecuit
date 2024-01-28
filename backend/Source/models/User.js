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
        return result.recordset;
    }catch(err){
        console.log(err);
    }
}

const getImgsUserById = async(userId)=> {
    try{
        let poolConnection = await sql.connect(config);
        const query = 'Select id, url From [dbo].[image] where userId= @UserId'
        const result = await poolConnection.request()
        .input('UserId',sql.id, userId)
        .query(query);
        return result.recordset
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



const updateUser = async (name, phone, dateOfBirth, NID, NDL, email, FNIDimg, BNIDimg, FNDLimg, BNDLimg)=>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'UPDATE [dbo].[user] SET name = @Name, phone = @Phone, dateOfBirth = @DateOfBirth, NID = @NID, NDL = @NDL Where email = @Email';
        await poolConnection.request()
        .input('Name', sql.NVarChar, name)
        .input('Phone', sql.NVarChar, phone)
        .input('DateOfBirth', sql.DateTime, dateOfBirth)
        .input('NID', sql.NVarChar, NID)
        .input('NDL', sql.NVarChar, NDL)
        .input('Email', sql.NVarChar, email)
        .query(query);
        const userId = (await getUserIdByEmail(email)).id
        addKindImgUser('FNID',FNIDimg, userId);
        addKindImgUser('BNID',BNIDimg, userId);
        addKindImgUser('FNDL',FNDLimg, userId);
        addKindImgUser('BNDL',BNDLimg, userId)
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
        if (message === 'BNDL') {
            idImg = 'BNDL' + userId;
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


const deleteUser = async (email) =>{
    try{
        let poolConnection = await sql.connect(config);
        const query = 'Delete from [dbo].[user] Where email = @Email';
        await poolConnection.request()
        .input('Email', sql.NVarChar, email)
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


const promotedMembership = async (userId)=>{
    try{
            const memberShipId = await getMemberShipIdUserCurrent(userId);
            const newMemberShipId = memberShipId+1;
            let poolConnection = await sql.connect(config)
            const query = 'Insert into [memberShipUser] (userId, memberShipId, timeChanged) Values (@UserId, @MemberShipId, @TimeChanged)'
            await poolConnection.request()
            .input('UserId', sql.Int, userId)
            .input('MemberShipId', sql.Int, newMemberShipId)
            .input('TimeChanged', sql.DateTime, util.currentTime)
            .query(query)
    }catch(err){
    
    }
}

const getMemberShipIdUserCurrent = async(userId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'SELECT memberShipId FROM [dbo].[memberShipUser] WHERE userId = @UserId AND id = (SELECT MAX(id) FROM [dbo].[memberShipUser] WHERE userId = @UserId)'
        const result = await poolConnection.request()
        .input('UserId', sql.Int, userId)
        .query(query)
        if (result.recordset.length > 0) {
            return result.recordset[0].memberShipId;
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
        if (user != null){
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


module.exports={
    getAllUser,
    createUser,
    updateUser,
    deleteUser,
    replyFeedback,
    editStatusUser,
    getNotification,
    sendNotification,
    promotedMembership,
    getMemberShipIdUserCurrent,
    checkLogin,
    getImgsUserById
}

