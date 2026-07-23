const {initializeApp,cert} = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIERBASESDK)
const firebaseadmin = initializeApp({
    credential:cert(serviceAccount)
});

module.exports = firebaseadmin;