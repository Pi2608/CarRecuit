const express = require('express')
const voucherController = require('../controllers/VoucherController')

const voucherRouter = express.Router()

voucherRouter.get('/', voucherController.getAllVoucher)
voucherRouter.get('/recommend', voucherController.getAllCarsInUse)
voucherRouter.post('/create', voucherController.createVoucher)
voucherRouter.put('/update/:id', voucherController.updateVoucher)
voucherRouter.put('/delete/:id', voucherController.deleteVoucher)
voucherRouter.get('/:id', voucherController.getVoucherById)

module.exports = voucherRouter

