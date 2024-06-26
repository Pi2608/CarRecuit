const User = require("../models/User")
const multer = require("multer")
const Uitl = require("../Util/Util");
const { response } = require("express");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Source/photos');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

const uploadImgs = upload.array('images', 5)

const getAllUser = async (req, res) => {
    try {
        const response = await User.getAllUser()
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId
        const response = await User.getUserById(userId)
        res.json(response)
    } catch (error) {

    }
}
const getUserByEmail = async (req, res) => {
    try {
        const email = req.params.email
        const response = await User.getUserByEmail(email)
        res.json(response);
    } catch (error) {

    }
}
const getNIDinfoByUserId = async (req, res) => {
    try {
        const userId = req.params.userId
        const response = await User.getNIDinfoByUserId(userId)
        res.json(response)
    } catch (error) {

    }
}
const getNDLinfoByUserId = async (req, res) => {
    try {
        const userId = req.params.userId
        const response = await User.getNDLinfoByUserId(userId)
        res.json(response)
    } catch (error) {

    }
}

const createUser = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        console.log(email + password)
        const response = await User.createUser(email, password)
        res.json(response)
    } catch (error) {

    }
}
const changePassword = async (req, res) => {
    try {
        const oldPass = req.body.oldPass
        const newPass = req.body.newPass
        const userId = req.params.userId
        const response = await User.changePassword(oldPass, newPass, userId)
        res.json(response)
    } catch (error) {

    }
}

const updateUser = async (req, res) => {
    try {
        const name = req.body.name
        const phone = req.body.phone
        const dateOfBirth = req.body.dateOfBirth
        const gender = req.body.gender
        const userId = req.params.userId
        const response = await User.updateUser(name, phone, dateOfBirth, gender, userId)
        res.json(response)
    } catch (error) {

    }
}

const updateImageUser = async (req, res) => {
    const userId = req.params.userId
    const imagePaths = req.files.map(file => file.path);
    let imgs = [];
    for (const path of imagePaths) {
        try {
            const base64Code = await Uitl.encodeImage(path);
            imgs.push(base64Code);
        } catch (error) {
            console.error('Error encoding image:', error);
        }
    }
    const response = await User.updateImageUser(userId, imgs[0])
    res.json(response)
}

const sendConfirmNID = async (req, res) => {
    try {
        const userId = req.params.userId
        const NID = req.body.NID
        const name = req.body.name
        const dateOfBirth = req.body.dateOfBirth
        const native = req.body.native
        const address = req.body.address
        const dateProvide = req.body.dateProvide
        const provider = req.body.provider
        const imagePaths = req.files.map(file => file.path);
        let imgs = [];
        for (const path of imagePaths) {
            try {
                const base64Code = await Uitl.encodeImage(path);
                imgs.push(base64Code);
            } catch (error) {
                console.error('Error encoding image:', error);
            }
        }
        const response = await User.sendConfirmNID(userId, NID, name, dateOfBirth, native, address, dateProvide, provider, imgs)
        res.json(response)
    } catch (error) {

    }
}
const sendConfirmNDL = async (req, res) => {
    try {
        const userId = req.params.userId
        const NDL = req.body.NDL
        const name = req.body.name
        const dateOfBirth = req.body.dateOfBirth
        // console.log(userId, name, dateOfBirth)
        const imagePaths = req.files.map(file => file.path);
        console.log(imagePaths)
        let imgs = [];
        for (const path of imagePaths) {
            try {
                const base64Code = await Uitl.encodeImage(path);
                imgs.push(base64Code);
            } catch (error) {
                console.error('Error encoding image:', error);
            }
        }
        const response = await User.sendConfirmNDL(userId, NDL, name, dateOfBirth, imgs)
        res.json(response)
    } catch (error) {

    }
}

const deleteUserById = async (req, res) => {
    try {
        const userId = req.params.userId
        const response = await User.deleteUserById(userId)
        res.json(response)
    } catch (error) {

    }
}

const replyFeedback = async (req, res) => {
    try {
        const userId = req.query.userId
        const message = req.body.message
        const rentDetailId = req.query.rentDetailId
        const rating = req.body.rating
        const response = await User.replyFeedback(userId, rentDetailId, message, rating)
        res.json(response)
    } catch (error) {

    }
}
const editStatusUser = async (req, res) => {
    try {
        const userId = req.query.userId
        const status = req.query.status
        const response = await User.editStatusUser(userId, status)
        res.json(response)
    } catch (error) {

    }
}
const getNotification = async (req, res) => {
    try {
        const userId = req.params.userId
        const response = await User.getNotification(userId)
        res.json(response)
    } catch (error) {

    }
}
const sendNotification = async (req, res) => {
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
const getMemberShipByUserId = async (req, res) => {
    try {
        const userId = req.params.userId
        const response = await User.getMemberShipByUserId(userId)
        res.json(response)
    } catch (error) {

    }
}
const checkLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const response = await User.checkLogin(email, password)
        res.json(response)
    } catch (error) {
        console.log(error)
    }
}
const totalTransactionUser = async (req,res)=>{
    try {
        const userId = req.params.userId
        const response =await User.totalTransactionUser(userId)
        res.json(response)
    } catch (error) {
        
    }
}
const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.params.userId
        const response = await User.getTransactionHistory(userId)
        res.json(response)
    } catch (error) {

    }
}
const editStatusNID = async (req, res) => {
    try {
        const NIDId = req.query.NIDId
        const status = req.query.status
        const response = await User.editStatusNID(NIDId, status)
        res.json(response)
    } catch (error) {

    }
}
const editStatusNDL = async (req, res) => {
    try {
        const NDLId = req.query.NDLId
        const status = req.query.status
        const response = await User.editStatusNDL(NDLId, status)
        res.json(response)
    } catch (error) {

    }
}
const showRequestConfirmNID = async (req, res) => {
    try {
        const response = await User.showRequestConfirmNID()
        res.json(response)
    } catch (error) {

    }
}
const showRequestConfirmNDL = async (req, res) => {
    try {
        const response = await User.showRequestConfirmNDL()
        res.json(response)
    } catch (error) {

    }
}
const registerByGg = async (req, res) => {
    try {
        const email = req.body.email
        const response = await User.registerByGg(email)
        res.json(response)
    } catch (error) {

    }
}

const getUserByToken = async (req, res) => {
    try {
        const token = req.query.token
        const response = await User.getUserByToken(token)
        res.json(response)
    } catch (error) {

    }
}
const checkCustomer = async (req, res, next) => {
    try {
        const userId = req.query.userId
        const role = (await User.getRoleByUserId(userId)).name
        console.log(role)
        if (role === 'Customer') {
            next();
        } else {
            res.json("bạn không đủ thẩm quyền")
        }
    } catch (error) {

    }
}
const checkStaff = async (req, res, next) => {
    try {
        const userId = req.query.userId
        const role = (await User.getRoleByUserId(userId)).name
        console.log(role)
        if (role === 'Staff') {
            next();
        } else {
            res.json("bạn không đủ thẩm quyền")
        }
    } catch (error) {

    }
}
const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.query.userId
        const role = (await User.getRoleByUserId(userId)).name
        console.log(role)
        if (role === 'System Administator') {
            next();
        } else {
            res.json("bạn không đủ thẩm quyền")
        }
    } catch (error) {

    }
}
const getCountUser = async (req, res)=>{
    try {
        const response = await User.getCountUser()
        res.json(response)
    } catch (error) {
        
    }
}
const checkFeedback = async (req,res)=>{
    try {
        await util.deleteAllImages()
        const userId = req.params.userId
        const response = await User.checkFeedback(userId)
        res.json(response)
    } catch (error) {
        
    }
}


module.exports = {
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
    registerByGg,
    getUserByToken,
    checkCustomer,
    checkStaff,
    checkAdmin,
    getUserById,
    updateImageUser,
    totalTransactionUser,
    getCountUser,
    checkFeedback
}