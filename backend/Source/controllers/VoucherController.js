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
const getAllCarsInUse = async(req, res)=>{
    try {
        const response = await voucher.getAllVoucherInUse()
        res.json(response)
    } catch (error) {
        
    }
}
module.exports={
    getVoucherById,
    getAllVoucher,
    createVoucher,
    deleteVoucher,
    updateVoucher,
    getAllCarsInUse
}
