const mongoose = require('mongoose')


const dbconnection = async() =>{
    try {
        mongoose.connect(process.env.DB_URL)
        console.log("Database Connected!!!")
    } catch (error) {
        console.log("Database Connection Error:",error)
    }
}



module.exports = dbconnection