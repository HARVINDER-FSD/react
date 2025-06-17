// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZaSdTqPf2PAE7XJx732o1uHdcP8UO8BQ",
  authDomain: "auth-93b24.firebaseapp.com",
  projectId: "auth-93b24",
  storageBucket: "auth-93b24.firebasestorage.app",
  messagingSenderId: "88116969318",
  appId: "1:88116969318:web:c04e6c7b679f2da78792a7",
  measurementId: "G-6038KETMQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
