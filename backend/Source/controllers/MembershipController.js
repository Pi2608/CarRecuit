const membership = require('../models/Membership')

const getAllMembership = async(req, res)=>{
    try {
        const response = await membership.getAllMembership()
        res.json(response)
    } catch (error) {
        
    }
}

const getMembershipById = async(req,res)=>{
    try {
        const id = req.params.id
        const response = await membership.getMembershipById(id)
        res.json(response)
    } catch (error) {
        
    }
}
const updateMembershipById = async(req, res)=>{
    try {
        const id = req.params.id
        const name = req.body.name
        const discount = req.body.discount
        const pointRequire = req.body.pointRequire
        const response = await membership.updateMembershipById(id, name,discount,pointRequire)
        res.json(response)
    } catch (error) {
        
    }
}

module.exports={
    getAllMembership,
    getMembershipById,
    updateMembershipById
}