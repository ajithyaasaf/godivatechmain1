// Firebase Admin SDK initialization for serverless functions
// This file ensures Firebase Admin is only initialized once

import admin from 'firebase-admin';

let firebaseApp;

try {
  // Check if app is already initialized
  firebaseApp = admin.app();
} catch (error) {
  // Initialize Firebase Admin SDK
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // If service account JSON is provided as an environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`
      });
      
      console.log('Firebase Admin initialized with service account');
    } catch (parseError) {
      console.error('Error parsing Firebase service account:', parseError);
      // Fallback to application default credentials
      firebaseApp = admin.initializeApp();
      console.log('Firebase Admin initialized with application default credentials (fallback)');
    }
  } else {
    // Use application default credentials if no service account is provided
    firebaseApp = admin.initializeApp();
    console.log('Firebase Admin initialized with application default credentials');
  }
}

// Export Firebase Admin instances
const firestore = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, firebaseApp, firestore, auth, storage };