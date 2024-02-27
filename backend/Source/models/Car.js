const sql = require('mssql');
const config = require("../config/dbconfig");
const util = require("../Util/Util");


const getAllCarsInUse= async()=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Select * From [dbo].[car] Where status = 1'
        const result = await poolConnection.request().query(query1);
        const cars= result.recordset;
        for (let car of cars){
            const query2 = `Select url from dbo.image where id LIKE '%FC%' AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const {img} = result2.recordset
            car.imgUrl = img 
        }
        return cars
    }catch(err){
        console.log(err)
    }
}

const getAllCarsOfOwner = async(ownnerId, status)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Select * From [dbo].[car] Where status = @status AND ownerId=@ownerId'
        const result = await poolConnection.request()
        .input('status', sql.Bit, status)
        .input('ownerId', sql.Int, ownnerId)
        .query(query1);
        const cars= result.recordset;
        for (let car of cars){
            const query2 = `Select url from dbo.image where id LIKE %FC% AND carId = @carId`
            const result2 = await poolConnection.request()
            .input('carId', sql.Int, car.id)
            .query(query2)
            const {img} = result2.recordset
            car.imgUrl = img 
        }
        return cars
    }catch(err){
        
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
        const car =  result.recordset;
        const imgs = await getImgsCarById(id)
        for (let img of imgs){
            img.url = await util.decodeImage(img.url, img.id)
        }
        return [car,imgs]
    }catch(err){
        
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
        const query = 'Select * From [dbo].[car] Where carId = @CarId'
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
        const Cars = await getAllCarsInUse();
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

const addCarRental = async (ownerId, name, carTypeId, CLP, price, discount ,description, seats, typeOfFuels, ldescription, imgs)=>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Insert into [dbo].[car] (ownerId, name, carTypeId, CLP, price, discount, description, seats, typeOfFuels, status) Values (@OwnerId, @name, @CarTypeId, @CLP, @Price, @Discount, @Description, @seats, @typeOfFuels, 1)';
        await poolConnection.request()
        .input('OwnerId', sql.Int, ownerId)
        .input('name', sql.NVarChar, name)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('CLP', sql.Int, CLP)
        .input('Price', sql.Money, price)
        .input('Discount', sql.Float, discount)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('TypeOfFuels', sql.NVarChar, typeOfFuels)
        .query(query1);
        const query2 =`Select MAX(id) as id from dbo.car`
        const result2= await poolConnection.request()
        .query(query2)
        const car = result2.recordset[0]
        const query3 = 'Insert ino dbo.location (typeLocationId, description) values (1, @ldescription)'
        await poolConnection.request()
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
    }catch(err){
        
    }
}

const updateCarRental = async (carId, name ,carTypeId, CLP, price, discount , description, seats, typeOfFuels, status, ldescription, imgs) =>{
    try{
        let poolConnection = await sql.connect(config)
        const query1 = 'Update [dbo].[car] set carTypeId = @CarTypeId, name=@name ,CLP = @CLP, price = @Price,discount = @Discount, description = @Description, seats = @Seats, typeOfFuels = @TypeOfFuels, status = @Status where id = @CarId'
        await poolConnection.request()
        .input('CarId', sql.Int, carId)
        .input('CarTypeId', sql.Int, carTypeId)
        .input('name', sql.Int, name)
        .input('CLP', sql.Int, CLP)
        .input('Price', sql.Money, price)
        .input('Discount', sql.Float, discount)
        .input('Description', sql.NVarChar, description)
        .input('Seats', sql.Int, seats)
        .input('TypeOfFuels', sql.NVarChar, typeOfFuels)
        .input('Status', sql.Bit, status)
        .query(query1);
        const query2 =`Update dbo.location set description = @ldescription where carId =@carId and typeLocationId = 1`
        await poolConnection.request()
        .input('ldescription', sql.NVarChar, ldescription)
        .input('carId', sql.Int, carId)
        .query(query2)
        for(let i = 0; i<imgs.length;i++){
            let id
            if(i==0){
                id = 'FC-'+carId+'-'+i
            }else{
                id = 'C-'+carId+'-'+i
            }
            const query3 =`Select * from dbo.image where id =@id`
            const result = await poolConnection.request()
            .input('id', sql.NVarChar, id)
            .query(query3)
            const image = result.recordset[0]
            if(image!=null){
                const query4 =`Update dbo.image set url =@imgUrl where id=@id`
                await poolConnection.request()
                .input('id', sql.NVarChar, id)
                .input('imgUrl', sql.NVarChar, imgs[i])
                .query(query4)
            }else{
                const query4 =`Insert into dbo.image (id, url, carId) values (@id, @imgUrl, @carId)`
                await poolConnection.request()
                .input('id', sql.NVarChar, id)
                .input('imgUrl', sql.NVarChar, imgs[i])
                .input('carId', sql.Int, carId)
                .query(query4)
            }
        } 
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
    getAllCarsOfOwner
}
