import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Check if required Firebase configuration is available
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(
  envVar => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.warn(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}. ` +
    'Using development configuration.'
  );
}

// Firebase configuration from environment variables with fallbacks
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDzIqWI6AApvWSE22y1Ug7h-8MysAo2fNw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 
    `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "godiva-tech"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "godiva-tech",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 
    `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "godiva-tech"}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "801444351245",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:801444351245:web:f030b472d6fb7be3d4f444",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KHE7CZP6EZ"
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
if (import.meta.env.DEV) {
  // Uncomment the following line to use Firestore emulator if available
  // import { connectFirestoreEmulator } from "firebase/firestore";
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

// Log Firebase initialization
console.log("Firebase initialized with project:", firebaseConfig.projectId);

export { app, db, analytics, auth, storage };