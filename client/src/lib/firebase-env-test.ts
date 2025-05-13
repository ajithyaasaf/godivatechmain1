// Firebase Environment Test Utility
// This file can be imported to validate Firebase configuration

import { getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

export async function testFirebaseConfig() {
  try {
    // Get the current Firebase app
    const app = getApp();
    console.log("Firebase Config Test - App initialized:", app.name);
    console.log("Firebase Config Test - Project ID:", app.options.projectId);
    console.log("Firebase Config Test - Auth Domain:", app.options.authDomain);

    // Test environment variables
    console.log("Firebase Config Test - Environment Variables:");
    console.log("  VITE_FIREBASE_API_KEY:", import.meta.env.VITE_FIREBASE_API_KEY ? "✓ Set" : "✗ Missing");
    console.log("  VITE_FIREBASE_PROJECT_ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✓ Set" : "✗ Missing");
    console.log("  VITE_FIREBASE_APP_ID:", import.meta.env.VITE_FIREBASE_APP_ID ? "✓ Set" : "✗ Missing");
    
    // Test Firestore connection
    const db = getFirestore(app);
    console.log("Firebase Config Test - Firestore instance:", db ? "✓ Created" : "✗ Failed");
    
    try {
      const testCollection = collection(db, "categories");
      const snapshot = await getDocs(testCollection);
      console.log(`Firebase Config Test - Firestore read test: ✓ Success (${snapshot.size} documents)`);
    } catch (error: any) {
      console.error("Firebase Config Test - Firestore read test: ✗ Failed", error.message);
    }
    
    // Test Authentication
    const auth = getAuth(app);
    console.log("Firebase Config Test - Auth instance:", auth ? "✓ Created" : "✗ Failed");
    
    try {
      // Only run this in development to avoid creating unnecessary anonymous users
      if (import.meta.env.DEV) {
        const userCredential = await signInAnonymously(auth);
        console.log("Firebase Config Test - Anonymous auth test: ✓ Success", userCredential.user.uid);
      } else {
        console.log("Firebase Config Test - Anonymous auth test: ⚠️ Skipped (production)");
      }
    } catch (error: any) {
      console.error("Firebase Config Test - Anonymous auth test: ✗ Failed", error.message);
    }
    
    // Test API Base URL
    const apiBaseUrl = import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL;
    console.log("Firebase Config Test - API Base URL:", apiBaseUrl || "⚠️ Not configured");
    
    return { success: true, message: "Firebase configuration test completed successfully" };
  } catch (error: any) {
    console.error("Firebase Config Test - Fatal error:", error.message);
    return { success: false, message: error.message };
  }
}

// Add a function to export the current Firebase configuration without secrets
export function getFirebaseConfigInfo() {
  try {
    const app = getApp();
    return {
      projectId: app.options.projectId,
      authDomain: app.options.authDomain,
      storageBucket: app.options.storageBucket,
      environment: import.meta.env.MODE,
      apiBaseUrl: import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || 'Not configured',
      hostname: window.location.hostname
    };
  } catch (error: any) {
    return { error: error.message };
  }
}