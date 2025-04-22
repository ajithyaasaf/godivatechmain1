import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
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

// Only initialize analytics in production and if it's in a browser environment
let analytics = null;
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  analytics = getAnalytics(app);
}

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage, analytics };