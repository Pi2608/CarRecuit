<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const VoucherController = require('../controllers/VoucherController');
// Get all vouchers
router.get('/', voucherController.getAllVouchers);

// Create a new voucher
router.post('/', voucherController.createVoucher);

// Update an existing voucher
router.put('/:id', voucherController.updateVoucher);

// Delete a voucher
router.delete('/:id', voucherController.deleteVoucher);

// Get voucher ID by code
router.get('/code/:code', voucherController.getVoucherIdByCode);

module.exports = router;
=======
const express = require('express')
const voucherController = require('../controllers/VoucherController')

const voucherRouter = express.Router()

voucherRouter.get('/', voucherController.getAllVoucher)
voucherRouter.get('/:id', voucherController.getVoucherById)
voucherRouter.post('/create', voucherController.createVoucher)
voucherRouter.put('/update/:id', voucherController.updateVoucher)
voucherRouter.put('/delete/:id', voucherController.deleteVoucher)

module.exports = voucherRouter
>>>>>>> 8d6ec76640ec7843a90cefc0eba9bf6cccfada63
