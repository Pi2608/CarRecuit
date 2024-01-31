const Voucher = require("../models/Voucher");


const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await voucherService.getAllVouchers();
        res.json(vouchers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createVoucher = async (req, res) => {
    const { voucherCode, discount, startDate, endDate } = req.body;
    try {
        const result = await voucherService.createVoucher(voucherCode, discount, startDate, endDate);
        res.json({ success: true, message: 'Voucher created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateVoucher = async (req, res) => {
    const { id } = req.params;
    const { voucherCode, discount, startDate, endDate } = req.body;
    try {
        const result = await voucherService.updateVoucher(id, voucherCode, discount, startDate, endDate);
        res.json({ success: true, message: 'Voucher updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteVoucher = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await voucherService.deleteVoucher(id);
        if (result) {
            res.json({ success: true, message: 'Voucher deleted successfully' });
        } else {
            res.status(404).json({ error: 'Voucher not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVoucherIdByCode = async (req, res) => {
    const { code } = req.params;
    try {
        const voucherId = await voucherService.getVoucherIdByCode(code);
        res.json({ voucherId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucherIdByCode,
};
