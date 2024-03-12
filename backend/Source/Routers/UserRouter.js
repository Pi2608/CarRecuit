const express = require("express")
const userController = require ("../controllers/UserController")

const userRouter = express.Router()

userRouter.get("/", userController.getAllUser)

userRouter.get("/NID", userController.showRequestConfirmNID)
userRouter.get("/NDL", userController.showRequestConfirmNDL)

userRouter.post("/login", userController.checkLogin)
userRouter.post("/register", userController.createUser)

userRouter.post("/changePass/:userId", userController.changePassword)
userRouter.post("/update/img/:userId", userController.uploadImgs, userController.updateImageUser)
userRouter.post("/update/:userId", userController.updateUser)
userRouter.put("/delete/:userId", userController.deleteUserById)
userRouter.put("/editStatus", userController.editStatusUser)

userRouter.post("/NID/sendConfirm/:userId", userController.uploadImgs, userController.sendConfirmNID)
userRouter.post("/NDL/sendConfirm/:userId", userController.uploadImgs, userController.sendConfirmNDL)

userRouter.post("/replyFeedback", userController.replyFeedback)

userRouter.get("/notification/:userId", userController.getNotification)
userRouter.put("/notification/send/:userId", userController.sendNotification)

userRouter.get("/membership/:userId", userController.getMemberShipByUserId)
userRouter.get("/transaction/total/:userId", userController.totalTransactionUser)
userRouter.get("/transaction/:userId", userController.getTransactionHistory)

userRouter.put("/NID/editStatus", userController.editStatusNID)
userRouter.put("/NDL/editStatus", userController.editStatusNDL)
userRouter.get("/NID/:userId", userController.getNIDinfoByUserId)
userRouter.get("/NDL/:userId", userController.getNDLinfoByUserId)
userRouter.post("/registerGG", userController.registerByGg)
userRouter.get("/getByToken", userController.getUserByToken)
userRouter.get("/email/:email", userController.getUserByEmail)
userRouter.get("/:userId", userController.getUserById)

module.exports = userRouter;