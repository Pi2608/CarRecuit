const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const util = require("../Util/Util");

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

    }
}


const updateUser = async (name, phone, dateOfBirth, NID, NDL, email, images)=>{
    try{
        let poolConnection = await sql.connect(config);
        const query1 = 'UPDATE [dbo].[user] SET name = @Name, phone = @Phone, dateOfBirth = @DateOfBirth, NID = @NID, NDL = @NDL Where email = @Email';
        await poolConnection.request()
        .input('Name', sql.NVarChar, name)
        .input('Phone', sql.NVarChar, phone)
        .input('DateOfBirth', sql.DateTime, dateOfBirth)
        .input('NID', sql.NVarChar, NID)
        .input('NDL', sql.NVarChar, NDL)
        .input('Email', sql.NVarChar, email)
        .query(query1);
        for (const image of images) {
            const query2 = 'INSERT INTO [dbo].[image] (url, userId) values (@URL, @UserId)';
            await poolConnection.request()
                .input('Url', sql.NVarChar, image)
                .input('UserId', sql.Int, getUserIdByEmail(email))
                .query(query2);
        }
    }catch(err){

    }
}

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


const promotedMembership = async (userId, timeChanged)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query2 = 'Insert into [memberShipUser] (userId, )'
    }catch(err){
        
    }
}

const getMemberShipUserCurrent = async(userId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'SELECT memberShipId FROM [dbo].[memberShipUser] WHERE userId = @UserId AND id = (SELECT MAX(id) FROM [dbo].[memberShipUser] WHERE userId = @UserId)'
        const result = await poolConnection.request()
        .input('UserId', sql.Int, userId)
        .query(query1)
        return result.recordset
    }catch(err){
        
    }
}

const checkLogin = async (email, password)=>{
    try{
        
    }catch(err){
        
    }
}

const addVoucher = async (voucherCode, userId)=>{
    try{

    }catch(err){
        
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
    getMemberShipUserCurrent,
    checkLogin,
    addVoucher,
}

