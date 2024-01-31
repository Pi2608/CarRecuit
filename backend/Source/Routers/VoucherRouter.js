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
