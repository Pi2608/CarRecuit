const express = require('express');
const cors = require('cors')
const paypal = require('paypal-rest-sdk');
const firebase = require('firebase');
const bodyParser = require('body-parser');
const schedule = require ('node-schedule')


const userRouter = require('./Source/Routers/UserRouter')
const membershipRouter = require('./Source/Routers/MembershipRouter')
const voucherRouter = require('./Source/Routers/VoucherRouter')
const amenitiesRouter = require('./Source/Routers/AmenitiesRouter')
const locationRouter = require('./Source/Routers/LocationRouter')
const carRouter = require('./Source/Routers/CarRouter')
const rentRouter = require('./Source/Routers/RentRouter')
const transactionRouter = require('./Source/Routers/TransactionRouter')
const voucher = require('./Source/models/Voucher')

const firebaseConfig = require('./Source/config/firebaseConfig')
const paypalConfig = require('./Source/config/paypalConfig');


const app = express()
const port = 4000

firebase.initializeApp(firebaseConfig);
paypal.configure(paypalConfig);

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/user", userRouter)
app.use("/membership", membershipRouter)
app.use("/voucher", voucherRouter)
app.use("/amenities", amenitiesRouter)
app.use("/location", locationRouter)
app.use("/car", carRouter)
app.use("/rent", rentRouter)
app.use("/transaction", transactionRouter)
app.use("/img", express.static('Source/photos'))
//set rule vào 7H thứ 2 hàng tuần
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek=1
rule.hour=7
rule.minute=0
rule.tz = 'Asia/Ho_Chi_Minh';
//Tạo voucher kéo dài 1 tuần
schedule.scheduleJob(rule,async()=>{
    await voucher.createVoucherAWeek(0.1);
});

app.listen(port, ()=>{
    console.log("Server is running on port "+ port)
})


