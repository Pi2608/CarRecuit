const express = require('express')
const transactionController = require('../controllers/TransactionController')

const transactionRouter = express.Router()

transactionRouter.post("/PayPal/pay/:userId", transactionController.pay)
transactionRouter.get("/PayPal/loadingPayment", transactionController.loadingPayment)
transactionRouter.post("/VNPay/create_payment_url/:userId", transactionController.create_payment_url)
transactionRouter.get("/VNPay/vnpay_return", transactionController.vnpay_return)

module.exports = transactionRouter