const voucher = require ('../models/Voucher')

const getVoucherById = async(req, res)=>{
    try {
        const id = req.params.id
        const response = await voucher.getVoucherById(id)
        res.json(response)
    } catch (error) {
        
    }
}

module.exports={
    getVoucherById
}