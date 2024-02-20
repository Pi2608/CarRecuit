const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");

const revenuestatisticsRental = async (year) => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `SELECT 
                            YEAR(dbo.rent.time) as year,
                            MONTH(dbo.rent.time) as month,
                            DATEPART(week, dbo.rent.time) as week,
                            COUNT(*) as total
                        FROM
                            dbo.rent
                        WHERE
                            dbo.rent.paymentId is not null AND
                            YEAR(dbo.rent.time) = @year
                        GROUP BY
                            YEAR(dbo.rent.time), MONTH(dbo.rent.time), DATEPART(week, dbo.rent.time)
                        ORDER BY
                            year, month, week`
        const result = await poolConnection.request()
            .input('year', sql.Int, year)
            .query(query)
        return result.recordset
    } catch (error) {
        // Handle error
    }
}
const countRental = async (carId) => {
    try {
        let poolConnection = await sql.connect(config)
        const query = `Select COUNT(dbo.rentDetail.id) As rentCount 
                        From 
                            dbo.rentDetail
                        inner join dbo.rent 
                            on dbo.rent.id = dbo.rentDetail.rentId
                        Where 
                            dbo.rent.paymentId is not null and 
                            dbo.rentDetail.carId = @carId
                        group by 
                            bo.rentDetail.carId`
        const result = await poolConnection.request()
            .input('carId', sql.Int, carId)
            .query(query)
        return result.recordset
    } catch (error) {

    }
}
module.exports = {
    countRental,
    revenuestatisticsRental,
}
