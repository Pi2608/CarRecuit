const sql = require('mssql');
const config = require("../config/dbconfig");

const getAllAmenities = async()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[amenities]'
        const result = await poolConnection.request().query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const createAmenities = async(name)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Insert into [dbo].[amenities] (name) values (@name)'
        await poolConnection.request()
        .input('name', sql.NVarChar, name)
        .query(query)
        return{
            message: "thêm thành công"
        }
    } catch (error) {
        
    }
}
const searchAmenitesByName = async(name) =>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select id From [dbo].[amenities] where name = @name'
        const result = await poolConnection.request().query(query)
        .input('name', sql.NVarChar, name)
        return result.recordset
    } catch (error) {
        
    }
}
const updateAmenities = async(id, name)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Update [dbo].[amenities] set name = @name where id = @id'
        await poolConnection.request()
        .input('name', sql.NVarChar, name)
        .input('id', sql.NVarChar, id)
        .query(query)
        return {
            message: "update thành công"
        }
    } catch (error) {
        
    }
}
module.exports = {
    getAllAmenities,
    createAmenities,
    updateAmenities,
    searchAmenitesByName
}