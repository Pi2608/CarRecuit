<<<<<<< HEAD
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
=======
const voucher = require ('../models/Voucher')

const getVoucherById = async(req, res)=>{
    try {
        const id = req.params.id
        const response = await voucher.getVoucherById(id)
        res.json(response)
    } catch (error) {
        
    }
}
const getAllVoucher = async(req, res)=>{
    try {
        const response =await voucher.getAllVoucher()
        res.json(response)
    } catch (error) {
        
    }
}
const createVoucher = async(req, res)=>{
    try {
        const discount = req.body.discount
        const startDate = req.body.startDate
        const endDate = req.body.endDate
        const response = await voucher.createVoucher(discount, startDate, endDate)
        res.json(response)
    } catch (error) {
        
    }
}
const deleteVoucher = async(req,res)=>{
    try {
        const id = req.params.id
        const response = await voucher.deleteVoucher(id)
        res.json(response)
    } catch (error) {
        
    }
}
const updateVoucher = async(req, res)=>{
    try {
        const id = req.params.id
        const voucherCode = req.body.voucherCode
        const discount = req.body.discount
        const startDate = req.body.startDate
        const endDate = req.body.endDate
        const response = await voucher.updateVoucher(id, voucherCode,discount,startDate,endDate)
        res.json(response)
    } catch (error) {
        
    }
}
module.exports={
    getVoucherById,
    getAllVoucher,
    createVoucher,
    deleteVoucher,
    updateVoucher
}
>>>>>>> 8d6ec76640ec7843a90cefc0eba9bf6cccfada63
