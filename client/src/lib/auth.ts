import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { app } from './firebase';

// Initialize Firebase Auth
const auth = getAuth(app);

/**
 * Register a new user with email and password
 * @param email User email
 * @param password User password
 * @param displayName Optional display name
 * @returns Promise with user credentials
 */
export const registerUser = async (
  email: string, 
  password: string, 
  displayName?: string
) => {
  try {
    console.log(`Attempting to register user with email: ${email}`);
    console.log(`Firebase project ID: ${auth.app.options.projectId}`);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User registered successfully, UID:', userCredential.user.uid);
    
    // Update the user profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
      console.log('User profile updated with display name');
    }
    
    return userCredential;
  } catch (error: any) {
    console.error('Error registering user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Firebase project ID during error:', auth.app.options.projectId);
    throw error;
  }
};

/**
 * Sign in a user with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with user credentials
 */
export const loginUser = async (email: string, password: string) => {
  try {
    console.log(`Attempting to sign in user with email: ${email}`);
    console.log(`Firebase project ID: ${auth.app.options.projectId}`);
    console.log(`Firebase auth domain: ${auth.app.options.authDomain}`);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in successfully, UID:', userCredential.user.uid);
    
    // Log token information (for debugging only)
    const token = await userCredential.user.getIdToken();
    console.log('Auth token retrieved successfully, length:', token.length);
    
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in user:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Firebase project ID during error:', auth.app.options.projectId);
    console.error('Environment:', import.meta.env.MODE); // 'development' or 'production'
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns Promise that resolves when sign out is complete
 */
export const logoutUser = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error('Error signing out user:', error);
    throw error;
  }
};

/**
 * Send a password reset email
 * @param email The email address to send the reset email to
 * @returns Promise that resolves when the email is sent
 */
export const resetPassword = async (email: string) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Listen for authentication state changes
 * @param callback Callback function that receives the user object
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth };