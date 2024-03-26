const sql = require('mssql');
const config = require("../config/dbconfig");
const util = require("../Util/Util");
const Location = require("./Location")


const getAllCars = async ()=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT car.*, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id`
        const result = await poolConnection.request().query(query1);
        const cars= result.recordset;
        for (let car of cars){
            const query2 = `Select * from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const img = result2.recordset[0]
            car.imgUrl = await util.decodeImage(img.url, img.id)
            const location = await Location.getCarLocation(car.id, 1)
            car.ldescription = location.city
        }
        return cars
    }catch(err){
        console.log(err)
    }
}
const getAllCarsInUse= async()=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT car.*, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id where car.status = 1 and car.isDeleted = 0 and car.isAccepted = 1`
        const result = await poolConnection.request().query(query1);
        const cars= result.recordset;
        for (let car of cars){
            const query2 = `Select * from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const img = result2.recordset[0]
            car.imgUrl = await util.decodeImage(img.url, img.id)
            const location = await Location.getCarLocation(car.id, 1)
            car.ldescription = location.city
        }
        return cars
    }catch(err){
        console.log(err)
    }
}

const getAllCarsOfOwner = async(ownnerId)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT car.*, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id where car.isDeleted = 0 and ownerId = @ownerId`
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
            car.imgUrl = await util.decodeImage(img.url, img.id)
        }
        return cars
    }catch(err){
        console.log(err)
    }
}

const recomendCar = async(numberItems)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT car.*, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id where car.status = 1 and car.isDeleted = 0 and car.isAccepted = 1`
        const result = await poolConnection.request().query(query1);
        const cars= result.recordset;
        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        const recommendedCars = [];
        const numItems = Math.min(numberItems, cars.length);
        for (let i = 0; i < numItems; i++) {
            const randomIndex = getRandomInt(0, cars.length - 1);
            recommendedCars.push(cars[randomIndex]);
        }
        for (let car of recommendedCars){
            const query2 = `Select * from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const img = result2.recordset[0]
            car.imgUrl = await util.decodeImage(img.url, img.id)
            const location = await Location.getCarLocation(car.id, 1)
            car.ldescription = location.city
        }
        return recommendedCars
    } catch (error) {
        console.log(error)
    }
}

const requestAcceptedCar = async ()=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT car.*, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name, dbo.[user].name as userName
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id
                        Inner join [dbo].[user] on car.ownerId = dbo.[user].id
                        where car.isAccepted is NULL`
        const result1 = await poolConnection.request()
        .query(query1)
        const cars = result1.recordset
        for (let car of cars){
            const query2 = `Select * from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const img = result2.recordset[0]
            car.imgUrl = await util.decodeImage(img.url, img.id)
            const location = await Location.getCarLocation(car.id, 1)
            car.ldescription = location.city
        }
        return cars
    } catch (error) {
        console.log(error)
    }
}

const editAcceptedCar = async(isAccepted, carId)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query =`Update dbo.car set isAccepted = @isAccepted where id = @carId`
        await poolConnection.request()
        .input('isAccepted', sql.Int, isAccepted)
        .input('carId', sql.Int, carId)
        .query(query)
        const query1 = `SELECT car.*, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id where car.id = @carId`
        const result1 = await poolConnection.request()
        .input('carId', sql.Int, carId)
        .query(query1)
        const car = result1.recordset[0]
        const senderId = 1
        let receivedId = car.ownerId
        let title
        let message
        const dateUp = await util.currentTime()
        if (isAccepted === '1'){
            title = 'Chấp đăng ký cho thuê chiếc xe '+ car.name
            message = 'Chiếc xe của đã được admin cấp quyền và duyệt cho thuê từ lúc ' + util.formatDate(dateUp)+ '. Chân thành cảm ơn'
        }else{
            title = 'Từ chối cho thuê chiếc xe '+ car.name
            message = 'Vì một số lí do. Admin đã quyết định không cấp phép chiếc xe này được cho thuê'
        }
        const query2 = `Insert into dbo.notification (senderId, receivedId, title, message, dateUp) values (@senderId, @receivedId, @title, @message, @dateUp)`
        await poolConnection.request()
        .input('senderId', sql.Int, senderId)
        .input('receivedId', sql.Int, receivedId)
        .input('title', sql.NVarChar, title)
        .input('message', sql.NVarChar, message)
        .input('dateUp', sql.DateTime, dateUp)
        .query(query2)
        return{
            message: "Cập nhật status thành công"
        }
    } catch (error) {
        console.log(error)
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
        const query = `SELECT car.*, (carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id where car.id = @id`
        const result = await poolConnection.request()
        .input("id", sql.Int, id)
        .query(query);
        const car =  result.recordset[0];
        const location = await Location.getCarLocation(car.id, 1)
        car.ldescription = location.city
        const imgs = await getImgsCarById(id)
        for(let i=0; i< imgs.length; i++){
            imgs[i].url = await util.decodeImage(imgs[i].url, imgs[i].id)
        }
        const query1 = `Select amenities.* from dbo.amenities
                        inner join dbo.carAmenities 
                        on carAmenities.amenitiesId = amenities.id
                        where carAmenities.carId = @carId`
        const result1 = await poolConnection.request()
        .input('carId', sql.Int, id)
        .query(query1)
        const amenities = result1.recordset
        return [car , imgs, amenities];
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

const filterCars=async(Cars, carTypeId, minPrice, maxPrice, seats, typeOfFuels, gearStick)=>{
    try{
        console.log(carTypeId, minPrice, maxPrice, seats, typeOfFuels, gearStick)
        const filteredCars = Cars.filter(car => {
            if (carTypeId && car.carTypeId.toString() !== carTypeId) {
                return false;
            }

            if (minPrice && car.price < parseInt(minPrice)) {
                return false;
            }

            if (maxPrice && car.price > parseInt(maxPrice)) {
                return false;
            }

            if (seats && car.seats.toString() !== seats) {
                return false;
            }

            if (typeOfFuels && car.typeOfFuels !== typeOfFuels) {
                return false;
            }

            if (gearStick && car.gearStick !== gearStick){
                return false;
            }
            return true;
        });

        return filteredCars;
    }catch(err){
        console.log(err)
    }
}

const addCarRental = async (ownerId, carTypeId, CLP, price, description, seats, year, gearStick, typeOfFuels, ldescription, imgs, amenities)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Insert into [dbo].[car] (ownerId, carTypeId, CLP, price, discount, description, seats, year, gearStick, typeOfFuels, status, isDeleted, isAccepted) Values (@OwnerId, @CarTypeId, @CLP, @Price, 0, @Description, @Seats, @year, @gearStick, @typeOfFuels, 1, 0, null)';
        await poolConnection.request()
        .input('OwnerId', sql.Int, ownerId)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('CLP', sql.NVarChar, CLP)
        .input('Price', sql.Float, price)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('year', sql.Int, year)
        .input('gearStick', sql.NVarChar, gearStick)
        .input('TypeOfFuels', sql.NVarChar, typeOfFuels)
        .query(query1);
        const query2 =`Select MAX(id) as id from dbo.car`
        const result2= await poolConnection.request()
        .query(query2)
        const car = result2.recordset[0]
        console.log(car)
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
        await addCarAmenities(car.Id, amenities)

        console.log("nice");
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
const updateCarRental = async (carId, carTypeId, CLP, price, discount , description, seats, year, gearStick, typeOfFuels, status, ldescription, imgs, amenities) =>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Update [dbo].[car] set carTypeId = @CarTypeId, CLP = @CLP, price = @Price,discount = @Discount, description = @Description, seats = @Seats, year = @year, gearStick=@gearStick, typeOfFuels = @TypeOfFuels, status = @Status where id = @CarId'
        await poolConnection.request()
        .input('CarId', sql.Int, carId)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('CLP', sql.NVarChar, CLP)
        .input('Price', sql.Float, price)
        .input('Discount', sql.Float, discount)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('year', sql.Int, year)
        .input('gearStick', sql.NVarChar, gearStick)
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

const getCarByLocationAndDate = async (location, dateStart, dateEnd)=>{
    try {
        let poolConnection = await sql.connect(config)
        const query1 = `SELECT car.*, location.city as ldescription ,(carType.name + ' ' + CONVERT(nvarchar(10), car.year)) AS name
                        FROM dbo.car
                        INNER JOIN dbo.carType ON car.carTypeId = carType.id
                        INNER JOIN [dbo].[location] on car.id = location.carId and location.typeLocationId = 1
                        where car.status = 1 and car.isDeleted = 0 and car.isAccepted = 1 and location.city = @location`
        const result1 = await poolConnection.request()
        .input ('location', sql.NVarChar, location)
        .query(query1)
        const filterCarsByLocation = result1.recordset
        const filrerCarsByLocationAndDate = []
        for(const car of filterCarsByLocation){
            const query2 = `Select rentDetail.pick_up, rentDetail.drop_off from dbo.rentDetail
                            INNER JOIN dbo.rent on rentDetail.rentId = rent.id
                            Where rentDetail.carId = @carId and rent.paymentId is not NULL`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const rentDetails = result2.recordset
            if (rentDetails[0]!=null){
                let status = true;
                for (const rentDetail of rentDetails){
                    if(await util.checkOverlap(rentDetail.pick_up, rentDetail.drop_off,await util.inputDate(dateStart), await util.inputDate(dateEnd))){
                        status = false;
                    }
                }
                if(status){
                    filrerCarsByLocationAndDate.push(car)
                }
            }else{
                filrerCarsByLocationAndDate.push(car)
            }
        }
        return filrerCarsByLocationAndDate
        
    } catch (error) {
        console.log(error)
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
    getCarType,
    recomendCar,
    requestAcceptedCar,
    editAcceptedCar,
    getAllCars,
    getCarByLocationAndDate
}
