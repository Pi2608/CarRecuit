const express = require("express");
const userController = require ("../controllers/UserController");

const userRouter = express.Router();

userRouter.get("/", userController.getAllUser);
