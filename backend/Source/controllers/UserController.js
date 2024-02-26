const User = require("../models/User")
const multer = require("multer")
const Uitl = require("../Util/Util")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Source/photos');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

const uploadImgs = upload.array('images', 5)

const getAllUser = async(req, res)=>{
    try{
        const response = await User.getAllUser()
        res.json(response);
    }catch(err){
        res.status(500).json({message: err.message})
    }
}
const getUserByEmail = async(req, res)=>{
    try {
        const email = req.params.email
        const response = await User.getUserByEmail(email)
        res.json(response);
    } catch (error) {
        
    }
}
const getNIDinfoByUserId = async(req, res)=>{
    try {
        const userId = req.params.userId
        const response = await User.getNIDinfoByUserId(userId)
        res.json(response)
    } catch (error) {
        
    }
}
const getNDLinfoByUserId = async(req, res)=>{
    try {
        const userId = req.params.userId
        const response = await User.getNDLinfoByUserId(userId)
        res.json(response)
    } catch (error) {
        
    }
}

const createUser = async(req, res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        console.log(email+password)
        const response = await User.createUser(email, password)
        res.json(response)
    } catch (error) {
        
    }
}
const changePassword = async(req,res)=>{
    try {
        const newPass = req.body.newPass
        const oldPass = req.body.oldPass
        const userId = req.params.userId
        const response = await User.changePassword(oldPass, newPass, userId)
        res.json(response)
    } catch (error) {
        
    }
}

const updateUser = async(req, res)=>{
    try {
        const name = req.body.name
        const phone = req.body.phone
        const dateOfBirth = req.body.dateOfBirth
        const userId = req.params.userId
        const response = await User.updateUser(name, phone, dateOfBirth, userId)
        res.json(response)
    } catch (error) {
        
    }
}

const sendConfirmNID = async(req, res)=>{
    try {
        const userId = req.params.userId
        const NID = req.body.NID
        const name = req.body.name
        const dateOfBirth = req.body.dateOfBirth
        const native = req.body.native
        const address = req.body.address
        const dateProvide = req.body.dateProvide
        const provider = req.body.provider
        const imagePaths = req.files.map(file=>file.path);
        let imgs = [];
        for (const path of imagePaths) {
            try {
                const base64Code = await Uitl.encodeImage(path);
                imgs.push(base64Code);
            } catch (error) {
                console.error('Error encoding image:', error);
            }
        }
        const response = await User.sendConfirmNID(userId,NID,name,dateOfBirth,native,address,dateProvide,provider,imgs)
        res.json(response)
    } catch (error) {
        
    }
}
const sendConfirmNDL = async(req, res)=>{
    try {
        const userId = req.params.userId
        const NDL = req.body.NDL
        const name = req.body.name
        const dateOfBirth = req.body.dateOfBirth
        const imagePaths = req.files.map(file=>file.path);
        let imgs = [];
        for (const path of imagePaths) {
            try {
                const base64Code = await Uitl.encodeImage(path);
                imgs.push(base64Code);
            } catch (error) {
                console.error('Error encoding image:', error);
            }
        }
        const response = await User.sendConfirmNDL(userId,NDL,name,dateOfBirth,imgs)
        res.json(response)
    } catch (error) {
        
    }
}

const deleteUserById = async(req, res)=>{
    try {
        const userId = req.params.userId
        const response = await User.deleteUserById(userId)
        res.json(response) 
    } catch (error) {
        
    }
}

const replyFeedback = async(req,res)=>{
    try {
        const userId = req.query.userId
        const message = req.body.message
        const carId = req.query.carId
        const rating = req.body.rating
        const response =await User.replyFeedback(userId,carId,message,rating)
        res.json(response)
    } catch (error) {
        
    }
}
const editStatusUser = async(req,res)=>{
    try {
        const userId = req.query.userId
        const status = req.query.status
        const response= await User.editStatusUser(userId,status)
        res.json(response)
    } catch (error) {
        
    }
}
const getNotification = async(req,res)=>{
    try {
        const userId = req.params.userId
        const response = await User.getNotification(userId)
        res.json(response) 
    } catch (error) {
        
    }
}
const sendNotification = async (req, res)=>{
    try {
        const senderId = req.params.userId
        const receivedId = req.body.receivedId
        const title = req.body.title
        const message = req.body.message
        const response = await User.sendNotification(receivedId, title, message, senderId)
        res.json(response)
    } catch (error) {
        
    }
}
const getMemberShipByUserId= async (req, res)=>{
    try {
        const userId = req.params.userId
        console.log(userId)
        const response = await User.getMemberShipByUserId(userId)
        res.json(response)
    } catch (error) {
        
    }
}
const checkLogin = async (req, res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
        const response = await User.checkLogin(email, password)
        res.json(response)
    } catch (error) {
        
    }
}
const getTransactionHistory = async(req, res)=>{
    try {
        const userId = req.params.userId
        const response = await User.getTransactionHistory(userId)
        res.json(response)
    } catch (error) {
        
    }
}
const editStatusNID = async(req, res)=>{
    try {
        const userId = req.query.userId
        const status = req.query.status
        const response = await User.editStatusNID(userId, status)
        res.json(response)
    } catch (error) {
        
    }
}
const editStatusNDL = async(req, res)=>{
    try {
        const userId = req.query.userId
        const status = req.query.status
        const response = await User.editStatusNDL(userId, status)
        res.json(response)
    } catch (error) {
        
    }
}
const showRequestConfirmNID = async(req, res)=>{
    try {
        const response = await User.showRequestConfirmNID()
        res.json(response)
    } catch (error) {
        
    }
}
const showRequestConfirmNDL = async(req,res)=>{
    try {
        const response = await User.showRequestConfirmNDL()
        res.json(response)
    } catch (error) {
        
    }
}
module.exports={
    getAllUser,
    getUserByEmail,
    getNIDinfoByUserId,
    getNDLinfoByUserId,
    createUser,
    changePassword,
    updateUser,
    uploadImgs,
    sendConfirmNID,
    sendConfirmNDL,
    deleteUserById,
    replyFeedback,
    editStatusUser,
    getNotification,
    sendNotification,
    getMemberShipByUserId,
    checkLogin,
    getTransactionHistory,
    editStatusNID,
    editStatusNDL,
    showRequestConfirmNDL,
    showRequestConfirmNID,
}