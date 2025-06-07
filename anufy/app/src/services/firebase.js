
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDB3JvWMThk_5EYmb4IWh54e60Ra_L2Dxc",
  authDomain: "application-ed096.firebaseapp.com",
  projectId: "application-ed096",
  storageBucket: "application-ed096.firebasestorage.app",
  messagingSenderId: "274507213799",
  appId: "1:274507213799:web:b7c988759eb02749ba2b42",
  measurementId: "G-ECBK3VBNRT"
};

const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app