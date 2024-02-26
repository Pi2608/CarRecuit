const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const Util = require('../Util/Util');

const recordCarLocation = async (carId)=>{
    try {
        let time = await Util.currentTime();
        let lat = await Util.getPositionCar.latitude;
        let lng = await Util.getPositionCar.longtitude;
        let poolConnection = await sql.connect(config);
        const query = 'Insert into location (carId, typeLocation, time, latitude, longtitude, description) values (@carId, 3, @time, @latitude, @longtitude, null)'
        await poolConnection.request()
        .input('carId', sql.NVarChar, carId)
        .input('time', sql.DateTime, time)
        .input('latitude', sql.Float, lat)
        .input('longtitude', sql.Float, lng)
        .query(query)
    } catch (error) {
        
    }
}

const addCarRentLocation = async (carId, typeLocation, latitude, longtitude, description)=>{
    try {
        let poolConnection = await sql.connect(config);
        const query = 'Insert into [dbo].[loction] (carId, typeLocation, time, latitude, longtitude, description) values (@carId, @typeLocation, null, @latitude, @longtitude, @description)'
        await poolConnection.request()
        .input('carId', sql.NVarChar, carId)
        .input('typeLocation', sql.Int, typeLocation)
        .input('latitude', sql.Float, latitude)
        .input('longtitude', sql.Float, longtitude)
        .input('description', sql.NVarChar, description)
        .query(query)
    } catch (error) {
        
    }
}

const getCarLocation = async(carId, typeLocation)=>{
    try {
        let poolConnection = await sql.connect(config);
        if (typeLocation == 3){
            await recordCarLocation(carId)
        }
        const query = 'Select TOP 1 latitude, longtitude From [dbo].[loction] where carId = @carId, typeLocation = @typeLocation Order By id DESC'
        const result = await poolConnection.request()
        .input('carId', sql.NVarChar, carId)
        .input('typeLocation', sql.Int, typeLocation)
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

module.exports={
    recordCarLocation,
    addCarRentLocation,
    getCarLocation
}


