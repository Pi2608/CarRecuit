const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const util = require("../Util/Util");

const getAllCars= async()=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[car] Where status = 0'
        const result = await poolConnection.request().query(query);
        return result.recordset;
    }catch(err){
        
    }
}

const getCarsByName = async(name)=>{
    try{
        if(name){
            let poolConnection = await sql.connect(config)
            const query = 'Select * From [dbo].[car] Where name like %@Name% and status =0'
            const result = await poolConnection.request()
            .input('Name', sql.NVarChar, name)
            .query(query);
            return result.recordset;
        }
        else return getAllCars;
    }catch(err){
        
    }
}

const getImgsCar = async(carId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Select url From [dbo].[car] Where carId = @CarId'
        const result = await poolConnection.request()
        .input("CarId", sql.Int, carId)
        .query(query);
        return result.recordset;
    }catch(err){
        
    }
}

const getCarsByPage= async(Cars, numPage, numItems) =>{
    try{

    }catch(err){
        
    }
}

const filterCars=async(Cars, carTypeId, minPrice, maxPrice, seats, typeOfFuels)=>{
    try{
        const filteredCars = Cars.filter(car => {
            if (carTypeId && car.carTypeId !== carTypeId) {
                return false;
            }

            if (minPrice && car.price < minPrice) {
                return false;
            }

            if (maxPrice && car.price > maxPrice) {
                return false;
            }

            if (seats && car.seats !== seats) {
                return false;
            }

            if (typeOfFuels && car.typeOfFuels !== typeOfFuels) {
                return false;
            }
            return true;
        });

        return filteredCars;
    }catch(err){
        
    }
}

const addCarRental = async (userId, carTypeId, CLP, price, description, seats, typeOfFuels, locationIp, ldescription)=>{
    try{

    }catch(err){
        
    }
}

const updateCarRental = async (carId, carTypeId, CLP, price, description, seats, typeOfFuels, status, locationIp, ldescription) =>{
    try{

    }catch(err){
        
    }
}

const deleteCarRental = async(carId)=>{
    try{

    }catch(err){
        
    }
}


module.exports={
    getAllCars,
    getCarsByName,
    getImgsCar,
    getCarsByPage,
    filterCars,
    addCarRental,
    updateCarRental,
    deleteCarRental
}
