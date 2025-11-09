// js/firebase.js
// NOTE: Storage intentionally NOT used (billing disabled). We will use static image URLs.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getFirestore, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAg5FUU-DBbhgpdXs1MiEGj1gTaSBjPhQ",
  authDomain: "e-commerce-project-b33ac.firebaseapp.com",
  projectId: "e-commerce-project-b33ac",
  storageBucket: "e-commerce-project-b33ac.firebasestorage.app",
  messagingSenderId: "1063618717791",
  appId: "1:1063618717791:web:e3da7c55ddc2d066be13ea",
  measurementId: "G-G32EMHP016"
};

// Initialize
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// re-exports for convenience
export {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, updateProfile, serverTimestamp
};
