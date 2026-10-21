const { initializeApp, cert } = require("firebase-admin");

let firebaseadmin = null;

try {
    const rawSdk = process.env.FIERBASESDK || process.env.FIREBASE_SDK || process.env.FIREBASESDK;
    if (rawSdk) {
        const serviceAccount = typeof rawSdk === "string" ? JSON.parse(rawSdk) : rawSdk;
        firebaseadmin = initializeApp({
            credential: cert(serviceAccount)
        });
        console.log("Firebase Admin Initialized successfully.");
    } else {
        console.warn("WARNING: FIERBASESDK is not defined in .env! Firebase features will be skipped.");
    }
} catch (error) {
    console.error("Firebase Admin Initialization Error:", error.message);
}

module.exports = firebaseadmin;