const sql = require('mssql');
const config = require("../config/dbconfig");
const Util = require('../Util/Util');
const axios = require('axios')

const recordCarLocation = async (carId) => {
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

const addCarRentLocation = async (carId, typeLocationId, latitude, longitude, description) => {
    try {
        let poolConnection = await sql.connect(config);
        const query2 = `Select * from [dbo].[location] where carId = @carId and typeLocationId = @typeLocationId`
        const result2 = await poolConnection.request()
            .input('carId', sql.Int, carId)
            .input('typeLocationId', sql.Int, typeLocationId)
            .query(query2)
        const location = result2.recordset[0]
        if (typeLocationId <= 2 && typeLocationId >= 1) {
            if (location == null) {
                const query = 'Insert into [dbo].[location] (carId, typeLocationId, time, latitude, longitude, description) values (@carId, @typeLocationId, null, @latitude, @longitude, @description, @city)'
                await poolConnection.request()
                    .input('carId', sql.NVarChar, carId)
                    .input('typeLocationId', sql.Int, typeLocationId)
                    .input('latitude', sql.Float, latitude)
                    .input('longitude', sql.Float, longitude)
                    .input('description', sql.NVarChar, description)
                    .input('city', sql.NVarChar, await getLocationInfo(latitude, longitude))
                    .query(query)
                return {
                    message: "thêm thành công"
                }
            } else {
                const query3 = `Update [dbo].[location] set latitude = @latitude ,longitude = @longitude,description = @description, city = @city where carId = @carId and typeLocationId= @typeLocationId`
                await poolConnection.request()
                    .input('carId', sql.NVarChar, carId)
                    .input('typeLocationId', sql.Int, typeLocationId)
                    .input('latitude', sql.Float, latitude)
                    .input('longitude', sql.Float, longitude)
                    .input('description', sql.NVarChar, description)
                    .input('city', sql.NVarChar, await getLocationInfo(latitude, longitude))
                    .query(query3)
                return {
                    message: "thêm thành công"
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const getCarLocation = async (carId, typeLocationId) => {
    try {
        let poolConnection = await sql.connect(config);
        if (typeLocationId == 3) {
            await recordCarLocation(carId)
        }
        const query = 'Select * From [dbo].[location] where carId = @carId and typeLocationId = @typeLocationId'
        const result = await poolConnection.request()
            .input('carId', sql.Int, carId)
            .input('typeLocationId', sql.Int, typeLocationId)
            .query(query)
        return result.recordset[0]
    } catch (error) {
        console.log(error)
    }
}
const getLocationAll = async () => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * from [dbo].[location] where typeLocationId = 1`
        const result = await poolConnection.request()
            .query(query)
        return result.recordset
    } catch (error) {
        console.log(error)
    }
}

const getLocationInfo = (lat, lng) => {
    return new Promise((resolve, reject) => {
        try {
            const api_key = 'AjGwezncWgzsT7JOkixSORUdf6NHErgmT-ioryq46DI-WSAGZgIa3BoAfoV9aQLm';
            const url = `https://dev.virtualearth.net/REST/v1/Locations/${lat},${lng}?key=${api_key}&culture=vi-VN`;
            axios.get(url)
                .then(response => {
                    const data = response.data;
                    if (data.resourceSets) {
                        const formattedAddress = data.resourceSets[0].resources[0].address.adminDistrict
                        resolve(formattedAddress);
                    } else {
                        console.log("qq")
                        reject(new Error('No address found for the provided coordinates'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

const addCityAll = async () => {
    try {
        let poolConnection = await sql.connect(config);
        const query1 = `Select * from dbo.location`
        const result1 = await poolConnection.request()
            .query(query1)
        const locations = result1.recordset
        for (let location of locations) {
            const query2 = `Update dbo.location set city = @city where carId = @carId`
            await poolConnection.request()
            .input('city', sql.NVarChar, await getLocationInfo(location.latitude, location.longitude))
            .input('carId', location.carId)
            .query(query2)
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    recordCarLocation,
    addCarRentLocation,
    getCarLocation,
    getLocationAll,
    getLocationInfo,
    addCityAll
}


