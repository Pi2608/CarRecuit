var userRouter = require('./backend/Routers/UserRouter')

const express = require ('express');
const app = express()

app.use('/User', userRouter)

app.listen (3000, ()=>{
    console.log('Server started on port')
})