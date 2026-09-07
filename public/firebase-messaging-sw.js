importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDeH8SssDLeu5Ggbj8toClBq2zGE-6Ku-c",
  authDomain: "nehdo-23bd4.firebaseapp.com",
  projectId: "nehdo-23bd4",
  storageBucket: "nehdo-23bd4.firebasestorage.app",
  messagingSenderId: "784435496062",
  appId: "1:784435496062:web:c50536275ff566ea93442f",
});


// firebase.initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG));

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