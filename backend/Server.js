const express = require('express');
const bodyParser = require('body-parser')
const userRouter = require('./Source/Routers/UserRouter')
const membershipRouter = require('./Source/Routers/MembershipRouter')
const voucherRouter = require('./Source/Routers/VoucherRouter')
const amenitiesRouter = require('./Source/Routers/AmenitiesRouter')
const locationRouter = require('./Source/Routers/LocationRouter')
const carRouter = require('./Source/Routers/CarRouter')
const app = express()

const port = 4000
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/user", userRouter)
app.use("/membership", membershipRouter)
app.use("/voucher", voucherRouter)
app.use("/amenities", amenitiesRouter)
app.use("/location", locationRouter)
app.use("/car", carRouter)
app.use("/img", express.static('Source/photos'))
app.listen(port, ()=>{
    console.log("Server is running on port "+ port)
})


