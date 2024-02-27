const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");

const createMembership = async(name, discount, pointRequire)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Insert into [dbo].[memberShip] (name, discount, pointRequire) values (%name, %discount, %pointRequire)'
        await poolConnection.request()
        .input('name', sql.NVarChar, name)
        .input('discount', sql.Float, discount)
        .input('pointRequire', sql.Int, pointRequire)
        .query(query)
    } catch (error) {
        console.log(error);
    }
}

const getAllMembership = async()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[memberShip]'
        const result = await poolConnection.request()
        .query(query)
        return result.recordset
    } catch (error) {
        console.log(error);
    }
}
const getMembershipById = async(id)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[memberShip] where id = @id'
        const result = await poolConnection.request()
        .input('id', sql.Int, id)
        .query(query)
        return result.recordset[0]
    } catch (error) {
        console.log(error);
    }
}

const updateMembershipById = async (id, name, discount, pointRequire)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Update [dbo].[memberShip] set name = @name, discount = @discount, pointRequire = @pointRequire where id = @id'
        await poolConnection.request()
        .input('name', sql.NVarChar, name)
        .input('discount', sql.Float, discount)
        .input('pointRequire', sql.Int, pointRequire)
        .input('id', sql.Int, id)
        .query(query)
        return{
            message: "update thành công"
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports={
    createMembership,
    getAllMembership,
    getMembershipById,
    updateMembershipById
}