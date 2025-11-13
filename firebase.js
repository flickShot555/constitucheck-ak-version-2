// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBW8YRSK9oqNHml_1gD6cXTT3a7oiswOY",
  authDomain: "constitucheck-297fe.firebaseapp.com",
  projectId: "constitucheck-297fe",
  storageBucket: "constitucheck-297fe.firebasestorage.app",
  messagingSenderId: "854379959783",
  appId: "1:854379959783:web:4852eb96b218ce53d1d942",
  measurementId: "G-GK9D1JB7T0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (e) {
  auth = getAuth(app); // if already initialized, use existing instance
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Functions
export const functions = getFunctions(app);

export { auth };
export default app;