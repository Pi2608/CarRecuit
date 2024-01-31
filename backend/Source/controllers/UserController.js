const User = require("../models/User")

const getAllUser = async(req, res)=>{
    try{
        const response = await User.getAllUser()
        res.json(response);
    }catch(err){}
}
module.exports={
    getAllUser
}