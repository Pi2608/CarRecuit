const express = require('express')
const voucherController = require('../controllers/VoucherController')

const voucherRouter = express.Router()

voucherRouter.get('/', voucherController.getAllVoucher)
voucherRouter.get('/:id', voucherController.getVoucherById)
voucherRouter.post('/create', voucherController.createVoucher)
voucherRouter.put('/update/:id', voucherController.updateVoucher)
voucherRouter.put('/delete/:id', voucherController.deleteVoucher)

module.exports = voucherRouter

