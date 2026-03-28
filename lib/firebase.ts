import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID as string,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID as string,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY as string,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN as string,
  firestoreDatabaseId: process.env
    .NEXT_PUBLIC_FIREBASE_FIRESTOREDATABASEID as string,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET as string,
  messagingSenderId: process.env
    .NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID as string,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
};

// Initialize Firebase SDK
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
