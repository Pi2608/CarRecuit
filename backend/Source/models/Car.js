const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const util = require("../Util/Util");

const getAllCars= async()=>{
    try{

    }catch(err){
        
    }
}

const getCarsByPage= async(Cars, numPage) =>{
    try{

    }catch(err){
        
    }
}

const filterCars=async()=>{
    try{

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
    getCarsByPage,
    filterCars,
    addCarRental,
    updateCarRental,
    deleteCarRental
}
