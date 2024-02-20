const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");
const util = require("../Util/Util");


const getAllCarsInUse= async()=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[car] Where status = 0'
        const result = await poolConnection.request().query(query);
        return result.recordset;
    }catch(err){
        
    }
}


const getCarById= async(id)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[car] Where id = @id'
        const result = await poolConnection.request()
        .input("id", sql.Int, id)
        .query(query);
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

const getCarsByPage = async (Cars, numPage, numItemsPerPage) => {
    try {
        const startIndex = (numPage - 1) * numItemsPerPage;
        const endIndex = startIndex + numItemsPerPage;

        return Cars.slice(startIndex, endIndex);
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};

const filterCars=async(carTypeId, minPrice, maxPrice, seats, typeOfFuels)=>{
    try{
        const Cars = await getAllCars();
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

const addCarRental = async (ownerId, companyId, carTypeId, CLP, price, discount ,description, seats, typeOfFuels, locationIp, ldescription, Imgs)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Insert into [dbo].[car] (ownerId, carTyper, CLP, price, discount, description, seats, typeOfFuels, status, companyId) Values (@OwnerId, @CarTyper, @CLP, @Price, @Discount, @Description, seats, typeOfFuels, 0, @CompanyId)';
        await poolConnection.request()
        .input('OwnerId', sql.Int, ownerId)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('CLP', sql.Int, CLP)
        .input('Price', sql.Money, price)
        .input('Discount', sql.Float, discount)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('TypeOfFuels', sql.NVarChar, typeOfFuels)
        .input('CompanyId', companyId)
        .query(query);
    }catch(err){
        
    }
}

const updateCarRental = async (carId, carTypeId, CLP, price, discount , description, seats, typeOfFuels, status, locationIp, ldescription, Imgs) =>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Update [dbo].[car] set carTypeId = @CarTypeId, CLP = @CLP, price = @Price,discount = @Discount, description = @Description, seats = @Seats, typeOfFuels = @TypeOfFuels, status = @Status where id = @CarId'
        await poolConnection.request()
        .input('CarId', sql.Int, carId)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('CLP', sql.Int, CLP)
        .input('Price', sql.Money, price)
        .input('Discount', sql.Float, discount)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('TypeOfFuels', sql.NVarChar, typeOfFuels)
        .input('Status', sql.Bit, status)
        .query(query);
    }catch(err){
        
    }
}

const deleteCarRental = async(carId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = "Update [dbo].[car] set isDeleted = 1 where id = @carId"
        await poolConnection.request()
        .input('CarId', sql.Int, carId)
        .query(query);
    }catch(err){
        
    }
}


module.exports={
    getAllCarsInUse,
    getCarsByName,
    getImgsCar,
    getCarsByPage,
    filterCars,
    addCarRental,
    updateCarRental,
    deleteCarRental,
    getCarById
}
