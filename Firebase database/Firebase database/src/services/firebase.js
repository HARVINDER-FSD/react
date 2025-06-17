// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKf73cRwYj016RdQSE2bQyMFN0Og_hfg0",
  authDomain: "database-11am.firebaseapp.com",
  projectId: "database-11am",
  storageBucket: "database-11am.firebasestorage.app",
  messagingSenderId: "613485684780",
  appId: "1:613485684780:web:0f11d525c2488f6cc1c989",
  measurementId: "G-B151R9LB4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
