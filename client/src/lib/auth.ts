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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
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
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in user:', error);
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