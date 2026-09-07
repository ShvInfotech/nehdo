import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

const app = initializeApp({
  apiKey: "AIzaSyDeH8SssDLeu5Ggbj8toClBq2zGE-6Ku-c",
  authDomain: "nehdo-23bd4.firebaseapp.com",
  projectId: "nehdo-23bd4",
  storageBucket: "nehdo-23bd4.firebasestorage.app",
  messagingSenderId: "784435496062",
  appId: "1:784435496062:web:c50536275ff566ea93442f",
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const messaging = getMessaging(app);