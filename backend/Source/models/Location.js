const sql = require('mssql');
const config = require("../config/dbconfig");
const Util = require('../Util/Util');

const recordCarLocation = async (carId)=>{
    try {
        let time = await Util.currentTime();
        let position = await Util.getPositionCar()
        let lat = position.latitude;
        let lng = position.longitude;
        let poolConnection = await sql.connect(config);
        const query = 'Insert into dbo.location (carId, typeLocationId, time, latitude, longitude, description) values (@carId, 3, @time, @latitude, @longitude, null)'
        await poolConnection.request()
        .input('carId', sql.NVarChar, carId)
        .input('time', sql.DateTime, time)
        .input('latitude', sql.Float, lat)
        .input('longitude', sql.Float, lng)
        .query(query)
    } catch (error) {
        console.log(error)
    }
}

const addCarRentLocation = async (carId, typeLocationId, latitude, longitude, description)=>{
    try {
        let poolConnection = await sql.connect(config);
        if (typeLocationId<=2 && typeLocationId>=1){
            const query = 'Insert into [dbo].[location] (carId, typeLocationId, time, latitude, longitude, description) values (@carId, @typeLocationId, null, @latitude, @longitude, @description)'
            await poolConnection.request()
            .input('carId', sql.NVarChar, carId)
            .input('typeLocationId', sql.Int, typeLocationId)
            .input('latitude', sql.Float, latitude)
            .input('longitude', sql.Float, longitude)
            .input('description', sql.NVarChar, description)
            .query(query)
            return{
                message: "thêm thành công"
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const getCarLocation = async(carId, typeLocationId)=>{
    try {
        let poolConnection = await sql.connect(config);
        if (typeLocationId == 3){
            await recordCarLocation(carId)
        }
        const query = 'Select TOP 1 * From [dbo].[location] where carId = @carId and typeLocationId = @typeLocationId  Order By id DESC'
        const result = await poolConnection.request()
        .input('carId', sql.NVarChar, carId)
        .input('typeLocationId', sql.Int, typeLocationId)
        .query(query)
        return result.recordset[0]
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    recordCarLocation,
    addCarRentLocation,
    getCarLocation
}


