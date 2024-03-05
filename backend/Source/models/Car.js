const sql = require('mssql');
const config = require("../config/dbconfig");
const util = require("../Util/Util");
const Location = require("./Location")


const getAllCarsInUse= async()=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Select * From [dbo].[car] Where status = 1 and isDeleted = 0'
        const result = await poolConnection.request().query(query1);
        const cars= result.recordset;
        for (let car of cars){
            console.log(car.id)
            const query2 = `Select * from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const img = result2.recordset[0]
            car.imgUrl = await util.decodeImage(img.url, img.id)
            const location = await Location.getCarLocation(car.id, 1)
            car.ldescription = location.description
        }
        return cars
    }catch(err){
        console.log(err)
    }
}

const getAllCarsOfOwner = async(ownnerId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Select * From [dbo].[car] Where ownerId=@ownerId'
        const result = await poolConnection.request()
        .input('ownerId', sql.Int, ownnerId)
        .query(query1);
        const cars= result.recordset;
        for (let car of cars){
            const query2 = `Select * from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const img = result2.recordset[0]
            console.log(img)
            car.imgUrl = await util.decodeImage(img.url, img.id)
        }
        return cars
    }catch(err){
        console.log(err)
    }
}

const showCarFeedback = async (carId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * From dbo.feedback where carId = @carId`
        const result = await poolConnection.request()
        .input('carId', sql.Int,carId)
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const getCarRating = async(carId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select * From dbo.feedback where carId = @carId`
        const result = await poolConnection.request()
        .input('carId', sql.Int,carId)
        .query(query)
        const feedbacks= result.recordset
        let rating = 0
        let count = 0
        for(const feedback of feedbacks){
            rating = rating + feedback.rating
            count++;
        }
        return (rating/count).toFixed(1)
    } catch (error) {
        
    }
}


const getCarById= async(id)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[car] Where id = @id'
        const result = await poolConnection.request()
        .input("id", sql.Int, id)
        .query(query);
        const car =  result.recordset[0];
        const imgs = await getImgsCarById(id)
        for(let i=0; i< imgs.length; i++){
            imgs[i].url = await util.decodeImage(imgs[i].url, imgs[i].id)
        }
        return [car, imgs];
    }catch(err){
        console.log(err)
    }
}

// const getCarsByName = async(name)=>{
//     try{
//         if(name){
//             let poolConnection = await sql.connect(config)
//             const query = 'Select * From [dbo].[car] Where name like %@Name% and status =0'
//             const result = await poolConnection.request()
//             .input('Name', sql.NVarChar, name)
//             .query(query);
//             return result.recordset;
//         }
//         else return getAllCars;
//     }catch(err){
        
//     }
// }

const getImgsCarById = async(carId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = 'Select * From [dbo].[image] Where carId = @CarId'
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
        console.log({
            carTypeId:carTypeId,
            maxPrice: maxPrice,
            minPrice:minPrice,
            seats:seats,
            typeOfFuels:typeOfFuels,
        })
        const Cars = await getAllCarsInUse();
        const filteredCars = Cars.filter(car => {
            if (carTypeId && car.carTypeId.toString() !== carTypeId) {
                return false;
            }

            if (minPrice && car.price < minPrice) {
                return false;
            }

            if (maxPrice && car.price > maxPrice) {
                return false;
            }

            if (seats && car.seats.toString() !== seats) {
                return false;
            }

            if (typeOfFuels && car.typeOfFuels !== typeOfFuels) {
                return false;
            }
            return true;
        });

        return filteredCars;
    }catch(err){
        console.log(err)
    }
}

const addCarRental = async (ownerId, carTypeId, CLP, price, description, seats, year, typeOfFuels, ldescription, imgs, amenities)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Insert into [dbo].[car] (ownerId, carTypeId, CLP, price, discount, description, seats, year, typeOfFuels, status, isDeleted) Values (@OwnerId, @CarTypeId, @CLP, @Price, 0, @Description, @Seats, @year, @typeOfFuels, 1, 0)';
        await poolConnection.request()
        .input('OwnerId', sql.Int, ownerId)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('CLP', sql.NVarChar, CLP)
        .input('Price', sql.Float, price)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('year', sql.Int, year)
        .input('TypeOfFuels', sql.NVarChar, typeOfFuels)
        .query(query1);
        const query2 =`Select MAX(id) as id from dbo.car`
        const result2= await poolConnection.request()
        .query(query2)
        const car = result2.recordset[0]
        const query3 = 'Insert into dbo.location (carId, typeLocationId, description) values (@carId, 1, @ldescription)'
        await poolConnection.request()
        .input('carId', sql.Int, car.id)
        .input('ldescription', sql.NVarChar, ldescription)
        .query(query3)
        for (let i = 0; i< imgs.length;i++){
            let id
            if(i==0){
                id = 'FC-'+car.id+'-'+i
            }else{
                id = 'C-'+car.id+'-'+i
            }
            const query4 =`Insert into dbo.image (id, url, carId) values (@id, @imgUrl, @carId)`
            await poolConnection.request()
            .input('id', sql.NVarChar, id)
            .input('imgUrl', sql.NVarChar, imgs[i])
            .input('carId', sql.Int, car.id)
            .query(query4)
        }
        await addCarAmenities(carId, amenities)
    }catch(err){
        console.log(err)
    }
}
const addCarAmenities = async (carId, amenities)=>{
    try {
        let poolConnection = await sql.connect(config)
        for (const amenity of amenities){
            const query = `Insert into dbo.carAmenities (carId, amenitiesId) values (@carId, @amenity)`
            await poolConnection.request()
            .input('carId', sql.Int, carId)
            .input('amenity', sql.Int, amenity)
            .query(query)
        }
        return{
            message:"Thêm amenities thành công"
        }
    } catch (error) {
        
    }
}
const updateCarRental = async (carId, carTypeId, CLP, price, discount , description, seats, year, typeOfFuels, status, ldescription, imgs, amenities) =>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Update [dbo].[car] set carTypeId = @CarTypeId, CLP = @CLP, price = @Price,discount = @Discount, description = @Description, seats = @Seats, year = @year, typeOfFuels = @TypeOfFuels, status = @Status where id = @CarId'
        await poolConnection.request()
        .input('CarId', sql.Int, carId)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('CLP', sql.NVarChar, CLP)
        .input('Price', sql.Float, price)
        .input('Discount', sql.Float, discount)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('year', sql.Int, year)
        .input('TypeOfFuels', sql.NVarChar, typeOfFuels)
        .input('Status', sql.Int, status)
        .query(query1);
        const query2 =`Update dbo.location set description = @ldescription where carId =@carId and typeLocationId = 1`
        await poolConnection.request()
        .input('ldescription', sql.NVarChar, ldescription)
        .input('carId', sql.Int, carId)
        .query(query2)
        const query3 = `Delete from dbo.image where carId = @carId`
        await poolConnection.request()
        .input('carId', sql.Int, carId)
        .query(query3)
        for(let i = 0; i<imgs.length;i++){
            let id
            if(i==0){
                id = 'FC-'+carId+'-'+i
            }else{
                id = 'C-'+carId+'-'+i
            }
            const query4 =`Insert into dbo.image (id, url, carId) values (@id, @imgUrl, @carId)`
            await poolConnection.request()
            .input('id', sql.NVarChar, id)
            .input('imgUrl', sql.NVarChar, imgs[i])
            .input('carId', sql.Int, carId)
            .query(query4)
        }
        updateCarAmenities (carId, amenities)
        return{
            message :"Update thành công"
        } 
    }catch(err){
        console.log(err)
    }
}
const updateCarAmenities = async (carId, amenities)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = "Delete from dbo.carAmenities where carId= @carId"
        await poolConnection.request()
        .input('carId', sql.Int, carId)
        .query(query1)
        await addCarAmenities(carId, amenities)
    } catch (error) {
        console.log(error)
    }
}
const deleteCarRental = async(carId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query = "Update [dbo].[car] set isDeleted = 1 where id = @carId"
        await poolConnection.request()
        .input('CarId', sql.Int, carId)
        .query(query);
        return{
            message: "Delete thành công"
        }
    }catch(err){
        console.log(err)
    }
}

const getBrandCar = async()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = "Select * from dbo.carBrand"
        const result = await poolConnection.request()
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const getCarType = async(carBrandId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = "Select * from dbo.carType where carBrandId = @carBrandId"
        const result = await poolConnection.request()
        .input('carBrandId', sql.Int, carBrandId)
        .query(query)
        return result.recordset
    } catch (error) {
        
    }
}

const getCarTypeByTypeId = async(typeId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query = "Select * from dbo.carType where id = @typeId"
        const result = await poolConnection.request()
        .input('typeId', sql.Int, typeId)
        .query(query)
        return result.recordset[0]
    } catch (error) {
        
    }
}



module.exports={
    getAllCarsInUse,
    getCarTypeByTypeId,
    // getCarsByName,
    getImgsCarById,
    getCarsByPage,
    filterCars,
    addCarRental,
    updateCarRental,
    deleteCarRental,
    getCarById,
    getCarRating,
    showCarFeedback,
    getAllCarsOfOwner,
    getBrandCar,
    getCarType
}
