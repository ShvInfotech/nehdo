const mongoose = require('mongoose')

const dbconnection = async () => {
    try {
        if (!process.env.DB_URL) {
            console.error("Database Connection Error: DB_URL is not defined in .env file!");
            return;
        }
        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connected Successfully!!!");
    } catch (error) {
        console.error("Database Connection Error:", error);
    }
}

module.exports = dbconnection;