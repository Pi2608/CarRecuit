const express = require("express")
const userController = require ("../controllers/UserController")

const userRouter = express.Router()

userRouter.get("/", userController.getAllUser)

userRouter.post("/login", userController.checkLogin)
userRouter.post("/register", userController.createUser)
userRouter.post("/registerGG", userController.registerByGg)

userRouter.post("/changePass/:userId", userController.changePassword)
userRouter.post("/update/:userId", userController.uploadImgs, userController.updateUser)
userRouter.put("/delete/:userId", userController.deleteUserById)
userRouter.put("/editStatus", userController.editStatusUser)

userRouter.post("/replyFeedback", userController.replyFeedback)

userRouter.get("/notification/:userId", userController.getNotification)
userRouter.put("/notification/send/:userId", userController.sendNotification)

userRouter.get("/membership/:userId", userController.getMemberShipByUserId)
userRouter.get("/transaction/:userId", userController.getTransactionHistory)

userRouter.get("/NID", userController.showRequestConfirmNID)
userRouter.get("/NDL", userController.showRequestConfirmNDL)
userRouter.put("/NID/editStatus", userController.editStatusNID)
userRouter.put("/NDL/editStatus", userController.editStatusNDL)
userRouter.get("/NID/:userId", userController.getNIDinfoByUserId)
userRouter.get("/NDL/:userId", userController.getNDLinfoByUserId)
userRouter.post("/NID/sendConfirm/:userId", userController.uploadImgs, userController.sendConfirmNID)
userRouter.post("/NDL/sendConfirm/:userId", userController.uploadImgs, userController.sendConfirmNDL)

userRouter.get("/getByToken", userController.getUserByToken)
userRouter.get("/email/:email", userController.getUserByEmail)
userRouter.get("/:userId", userController.getUserById)

module.exports = userRouter;