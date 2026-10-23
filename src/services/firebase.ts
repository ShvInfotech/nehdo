import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

const app = initializeApp({
  apiKey: "AIzaSyALeiD_aBE1kJn_HJxLmwLnu-p0N1moA6k",
  authDomain: "nehdo-74a10.firebaseapp.com",
  projectId: "nehdo-74a10",
  storageBucket: "nehdo-74a10.firebasestorage.app",
  messagingSenderId: "262457932395",
  appId: "1:262457932395:web:5c1538644b37f2aaeb4f2e",
  measurementId: "G-XCG8XYR46D"
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const messaging = getMessaging(app);

export const getDeviceToken = async (): Promise<string | null> => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("Notifications are not supported in this browser");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.log("Service Worker not supported");
      return null;
    }

    const swPath = `${import.meta.env.BASE_URL}firebase-messaging-sw.js`;
    const registration = await navigator.serviceWorker.register(swPath);
    const token = await getToken(messaging, {
      vapidKey: "BMqAU55Rb_2glHLjhJ5GXL08R61O58MTia0XvU7_4J_HabRJSyVN7qCEx2Ud1PPfhAi6Ipr2EFXYfcWjECiYVyM",
      serviceWorkerRegistration: registration,
    });
    return token;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
};