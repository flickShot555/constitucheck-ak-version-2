// src/Services/auth.jsx
/**
  import React, { createContext, useContext, useEffect, useState } from "react";
  import firebase from "firebase"; // firebase v8 style (compat)
  import "firebase/auth";
  import "firebase/firestore";
*/

/*
  How to use:
  - Option A (recommended): Replace FIREBASE_CONFIG below with your firebaseConfig object.
  - Option B: If you already initialize firebase somewhere else (e.g. App.js)
              remove the firebase.initializeApp(...) block and just import firebase here:
                // import { auth } from "../path/to/your/firebase-init";
              then change uses of firebase.auth() to auth.

  This file exposes:
  - AuthProvider: wrap your app with this to provide auth state
  - useAuth(): hook to access { user, loading, signUp, logIn, logOut }
*/


  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBKhxqUj1lvRdwE4f5OSBYdNPejCdZsW-c",
    authDomain: "constitucheck.firebaseapp.com",
    projectId: "constitucheck",
    storageBucket: "constitucheck.firebasestorage.app",
    messagingSenderId: "1013706895454",
    appId: "1:1013706895454:web:20eb2f071a7fc6903c44cf",
    // measurementId: "G-XXXX" // optional
  };


// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  // If the user didn't replace FIREBASE_CONFIG, we still initialize with the placeholder;
  // you should replace it with your actual config (or remove this init and import your own firebase instance).
  firebase.initializeApp(FIREBASE_CONFIG);
}

// Optional: Firestore reference if you want to sync user data
const firestore = firebase.firestore();
const auth = firebase.auth();

// --- Auth Context ---
const AuthContext = createContext({
  user: null,
  loading: true,
  signUp: async (email, password) => {},
  logIn: async (email, password) => {},
  logOut: async () => {},
});

/**
 * AuthProvider
 * Wrap your App with <AuthProvider> so nested components can call useAuth()
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        // Optionally fetch additional user profile from Firestore:
        // const doc = await firestore.collection('users').doc(fbUser.uid).get();
        // const profile = doc.exists ? doc.data() : null;
        setUser(fbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signUp(email, password, extraProfile = {}) {
    try {
      const credential = await auth.createUserWithEmailAndPassword(email, password);
      const fbUser = credential.user;

      // optionally store extra profile info to Firestore
      if (fbUser) {
        try {
          await firestore.collection("users").doc(fbUser.uid).set({
            email: fbUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            ...extraProfile,
          });
        } catch (err) {
          // If Firestore write fails, we still have an authenticated user.
          console.warn("Failed to write user profile to Firestore:", err.message);
        }
      }

      return { user: fbUser };
    } catch (error) {
      // normalize error message
      throw new Error(error.message || "Sign up failed");
    }
  }

  async function logIn(email, password) {
    try {
      const credential = await auth.signInWithEmailAndPassword(email, password);
      return { user: credential.user };
    } catch (error) {
      // map some common errors to friendlier messages (optional)
      let message = error.message || "Login failed";
      if (error.code === "auth/user-not-found") message = "No account found for that email.";
      if (error.code === "auth/wrong-password") message = "Email or password is incorrect.";
      throw new Error(message);
    }
  }

  async function logOut() {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      throw new Error(error.message || "Sign out failed");
    }
  }

  // you can expose additional helper methods (sendPasswordResetEmail, updateProfile, etc.)
  const value = {
    user,
    loading,
    signUp,
    logIn,
    logOut,
    auth, // raw firebase auth instance if you need it elsewhere
    firestore,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth - convenient hook for components
 * const { user, loading, signUp, logIn, logOut } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
