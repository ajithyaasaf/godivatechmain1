import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDzIqWI6AApvWSE22y1Ug7h-8MysAo2fNw",
  authDomain: "godiva-tech.firebaseapp.com",
  projectId: "godiva-tech",
  storageBucket: "godiva-tech.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "801444351245",
  appId: "1:801444351245:web:f030b472d6fb7be3d4f444",
  measurementId: "G-KHE7CZP6EZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize analytics only if supported (prevents errors in test/development environments)
let analytics = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(e => {
  console.log("Firebase analytics not supported:", e);
});

const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Firestore with emulator in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment the following line to use Firestore emulator if available
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

// Log Firestore initialization
console.log("Firebase initialized with project:", firebaseConfig.projectId);

export { app, db, analytics, auth, storage };