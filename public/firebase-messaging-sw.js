importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyALeiD_aBE1kJn_HJxLmwLnu-p0N1moA6k",
  authDomain: "nehdo-74a10.firebaseapp.com",
  projectId: "nehdo-74a10",
  storageBucket: "nehdo-74a10.firebasestorage.app",
  messagingSenderId: "262457932395",
  appId: "1:262457932395:web:5c1538644b37f2aaeb4f2e",
  measurementId: "G-XCG8XYR46D"
});



const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  self.registration.showNotification(
    payload.notification?.title || "New Notification",
    {
      body: payload.notification?.body || "",
      icon: "/firebase-logo.png",
    }
  );
});