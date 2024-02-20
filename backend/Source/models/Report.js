const sql = require("mssql/msnodesqlv8");
const config = require("../config/dbconfig");

// Function to calculate total revenue by week
const calculateWeeklyRevenue = async () => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`
            SELECT DATEPART(WEEK, r.CreatedAt) AS WeekNumber,
                   DATEPART(YEAR, r.CreatedAt) AS Year,
                   SUM(r.Total) AS TotalRevenue
            FROM Rent r
            GROUP BY DATEPART(YEAR, r.CreatedAt), DATEPART(WEEK, r.CreatedAt)
            ORDER BY Year, WeekNumber;
        `);
        return result.recordset;
    } catch (err) {
        throw new Error(`Error calculating weekly revenue: ${err.message}`);
    }
};

// Function to calculate total revenue by month
const calculateMonthlyRevenue = async () => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`
            SELECT YEAR(r.CreatedAt) AS Year,
                   MONTH(r.CreatedAt) AS Month,
                   SUM(r.Total) AS TotalRevenue
            FROM Rent r
            GROUP BY YEAR(r.CreatedAt), MONTH(r.CreatedAt)
            ORDER BY Year, Month;
        `);
        return result.recordset;
    } catch (err) {
        throw new Error(`Error calculating monthly revenue: ${err.message}`);
    }
};

// Generate report
const generateReport = async () => {
    try {
        let weeklyRevenue = await calculateWeeklyRevenue();
        let monthlyRevenue = await calculateMonthlyRevenue();

        // Format the results into a report format
        let report = {
            weeklyRevenue: weeklyRevenue.map((item) => ({
                week: item.WeekNumber,
                year: item.Year,
                totalRevenue: item.TotalRevenue
            })),
            monthlyRevenue: monthlyRevenue.map((item) => ({
                month: item.Month,
                year: item.Year,
                totalRevenue: item.TotalRevenue
            }))
        };

        return report;
    } catch (err) {
        throw new Error(`Error generating report: ${err.message}`);
    }
};

// Example usage
generateReport()
    .then((report) => {
        console.log("Weekly Revenue:");
        console.log(report.weeklyRevenue);
        console.log("Monthly Revenue:");
        console.log(report.monthlyRevenue);
    })
    .catch((err) => {
        console.error(err);
    });
