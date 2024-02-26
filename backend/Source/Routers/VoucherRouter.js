const express = require('express')
const voucherController = require('../controllers/VoucherController')

const voucherRouter = express.Router()

voucherRouter.get('/:id', voucherController.getVoucherById)

module.exports = voucherRouter
