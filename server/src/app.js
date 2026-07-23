require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const app = express()
const port = process.env.PORT
const host = process.env.host
const dbconnection = require('./config/dbconnection')
const { GlobelErrorHandaling } = require('./middleware/globelError')



app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(morgan("dev"))
app.use("/uploads",express.static('src/uploads'));


app.use('/',require('./routes/index.routes'))
app.use(GlobelErrorHandaling)

app.listen(port,(err)=>{
    if(!err){
        console.log(`Server start at http://${host}:${port} `)
        dbconnection()
    }else{
        console.log("Server starting probleme:",err)
    }
})