import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

// Firebase configuration for client usage
export const firebaseConfig = {
  apiKey: "AIzaSyDzIqWI6AApvWSE22y1Ug7h-8MysAo2fNw",
  authDomain: "godiva-tech.firebaseapp.com",
  projectId: "godiva-tech",
  storageBucket: "godiva-tech.firebasestorage.app",
  messagingSenderId: "801444351245",
  appId: "1:801444351245:web:f030b472d6fb7be3d4f444",
  measurementId: "G-KHE7CZP6EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };