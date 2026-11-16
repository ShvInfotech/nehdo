import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, isSupported, Messaging } from "firebase/messaging";

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

// Messaging is created only where supported (HTTPS/localhost with Service Worker
// + Push). Calling getMessaging() directly throws on unsupported browsers, e.g.
// iPhone Safari outside an installed web app, which would break the whole site.
export let messaging: Messaging | null = null;

/** Resolves to the Messaging instance, or null where push is unsupported. */
export const messagingReady: Promise<Messaging | null> =
  typeof window === "undefined"
    ? Promise.resolve(null)
    : isSupported()
        .then((supported) => {
          if (supported && "serviceWorker" in navigator) {
            try {
              messaging = getMessaging(app);
            } catch (e) {
              console.warn("Firebase messaging initialization skipped:", e);
            }
          }
          return messaging;
        })
        .catch(() => null);

/** FCM device token for push notifications, or null when unsupported / denied. */
export const getDeviceToken = async (): Promise<string | null> => {
  try {
    if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
      return null;
    }
    const m = await messagingReady;
    if (!m) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const swPath = `${import.meta.env.BASE_URL}firebase-messaging-sw.js`;
    const registration = await navigator.serviceWorker.register(swPath);
    const token = await getToken(m, {
      vapidKey: "BMqAU55Rb_2glHLjhJ5GXL08R61O58MTia0XvU7_4J_HabRJSyVN7qCEx2Ud1PPfhAi6Ipr2EFXYfcWjECiYVyM",
      serviceWorkerRegistration: registration,
    });
    return token || null;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
};
