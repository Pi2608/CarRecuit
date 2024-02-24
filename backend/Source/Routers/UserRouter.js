const express = require("express");
const userController = require ("../controllers/UserController");

const userRouter = express.Router();

userRouter.get("/", userController.getAllUser);
userRouter.get("/:email", userController.getUserByEmail);
userRouter.get("/NID/:userId", userController.getNIDinfoByUserId);
userRouter.get("/NDL/:userId", userController.getNDLinfoByUserId);
userRouter.post("/register", userController.createUser);
userRouter.post("/changePass/:userId", userController.changePassword);
userRouter.post("/update/:userId", userController.updateUser);
userRouter.post("/NID/sendConfirm/:userId", userController.uploadImgs, userController.sendConfirmNID);
userRouter.post("/NDL/sendConfirm/:userId", userController.uploadImgs, userController.sendConfirmNDL);
userRouter.put("/delete/:userId", userController.deleteUserById);
userRouter.post("/replyFeedback", userController.replyFeedback);
userRouter.put("/editStatus", userController.editStatusUser);
userRouter.get("/notification/:userId", userController.getNotification)
userRouter.put("/notification/send/:userId", userController.sendNotification)

module.exports = userRouter;