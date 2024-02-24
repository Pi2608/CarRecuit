const express = require('express');
const bodyParser = require('body-parser')
const userRouter = require('./Source/Routers/UserRouter')
const app = express()

const port = 4000
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/user", userRouter)
app.use("/img", express.static('Source/photos'))
app.listen(port, ()=>{
    console.log("Server is running on port "+ port)
})


