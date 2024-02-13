const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");

const countRentalCar = async (carId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = 'Select COUNT(dbo.rentDetail.id) As rentCount From dbo.rentDetail inner join dbo.rent '
        + 'on dbo.rent.id = dbo.rentDetail.rentId '
        + 'Where dbo.rent.paymentId is not null and ' 
        + 'dbo.rentDetail.carId = @carId '
        + 'group by dbo.rentDetail.carId '
        const result = await poolConnection.request()
        .input('carId', sql.Int, carId)
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const statisticRentalByYear = async (year)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = ''
        const result = await poolConnection.request()
        .input()
        .query(query)
        return result.recordset
    }catch(error){

    }
}

const createRent = async (userId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = ''
        const result = await poolConnection.request()
        .input()
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const getRent = async (id)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = ''
        const result = await poolConnection.request()
        .input()
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const addRentDetail = async ()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = ''
        const result = await poolConnection.request()
        .input()
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const deleteRentDetail = async()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = ''
        const result = await poolConnection.request()
        .input()
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const confirmPayment = async ()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = ''
        const result = await poolConnection.request()
        .input()
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}
 



module.exports = {
    countRentalCar,
    statisticRentalByYear
}