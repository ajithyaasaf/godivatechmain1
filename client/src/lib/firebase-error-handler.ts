import { FirebaseError } from 'firebase/app';
import { FirebaseServiceError, FirebaseErrorType } from './firebase-service';
import { NetworkStatus, getNetworkStatus } from '../hooks/use-network-status';

/**
 * Constants for Firebase error handling
 */
export const FIREBASE_ERROR_CODES = {
  // Auth errors
  INVALID_EMAIL: 'auth/invalid-email',
  USER_DISABLED: 'auth/user-disabled',
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  INVALID_PASSWORD: 'auth/invalid-password',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  EXPIRED_ACTION_CODE: 'auth/expired-action-code',
  
  // Firestore errors
  PERMISSION_DENIED: 'permission-denied',
  UNAVAILABLE: 'unavailable',
  UNAUTHENTICATED: 'unauthenticated',
  NOT_FOUND: 'not-found',
  ALREADY_EXISTS: 'already-exists',
  RESOURCE_EXHAUSTED: 'resource-exhausted',
  FAILED_PRECONDITION: 'failed-precondition',
  DEADLINE_EXCEEDED: 'deadline-exceeded',
  CANCELLED: 'cancelled',
  INTERNAL: 'internal',
  UNKNOWN: 'unknown',
};

/**
 * User-friendly error messages for common Firebase errors
 */
export const FIREBASE_ERROR_MESSAGES = {
  // Auth errors
  [FIREBASE_ERROR_CODES.INVALID_EMAIL]: 'The email address is not valid.',
  [FIREBASE_ERROR_CODES.USER_DISABLED]: 'This account has been disabled by an administrator.',
  [FIREBASE_ERROR_CODES.USER_NOT_FOUND]: 'No account found with this email address.',
  [FIREBASE_ERROR_CODES.WRONG_PASSWORD]: 'Incorrect password. Please try again.',
  [FIREBASE_ERROR_CODES.EMAIL_ALREADY_IN_USE]: 'This email address is already in use.',
  [FIREBASE_ERROR_CODES.INVALID_PASSWORD]: 'Password must be at least 6 characters.',
  [FIREBASE_ERROR_CODES.TOO_MANY_REQUESTS]: 'Too many sign-in attempts. Please try again later.',
  [FIREBASE_ERROR_CODES.EXPIRED_ACTION_CODE]: 'This link has expired. Please request a new one.',
  
  // Firestore errors
  [FIREBASE_ERROR_CODES.PERMISSION_DENIED]: 'You don\'t have permission to access this data.',
  [FIREBASE_ERROR_CODES.UNAVAILABLE]: 'The service is currently unavailable. Please try again later.',
  [FIREBASE_ERROR_CODES.UNAUTHENTICATED]: 'Please sign in to access this data.',
  [FIREBASE_ERROR_CODES.NOT_FOUND]: 'The requested data could not be found.',
  [FIREBASE_ERROR_CODES.ALREADY_EXISTS]: 'This data already exists and cannot be created again.',
  [FIREBASE_ERROR_CODES.RESOURCE_EXHAUSTED]: 'You\'ve reached the rate limit. Please try again later.',
  [FIREBASE_ERROR_CODES.FAILED_PRECONDITION]: 'The operation failed because a condition wasn\'t met.',
  [FIREBASE_ERROR_CODES.DEADLINE_EXCEEDED]: 'The operation took too long to complete.',
  [FIREBASE_ERROR_CODES.CANCELLED]: 'The operation was cancelled.',
  [FIREBASE_ERROR_CODES.INTERNAL]: 'An internal error occurred. Please try again later.',
  [FIREBASE_ERROR_CODES.UNKNOWN]: 'An unknown error occurred. Please try again.',
};

/**
 * Provides more user-friendly error messages for Firebase errors
 * 
 * @param error The Firebase error to get a user-friendly message for
 * @returns A user-friendly error message
 */
export function getFirebaseErrorMessage(error: FirebaseError | FirebaseServiceError | Error | unknown): string {
  // Handle network errors
  if (getNetworkStatus() === NetworkStatus.OFFLINE) {
    return 'You are currently offline. Please check your internet connection and try again.';
  }
  
  // Handle FirebaseServiceError first (our custom error)
  if (error instanceof FirebaseServiceError) {
    switch (error.type) {
      case FirebaseErrorType.NETWORK:
        return 'Network error. Please check your internet connection and try again.';
      case FirebaseErrorType.PERMISSION:
        return 'You don\'t have permission to perform this action.';
      case FirebaseErrorType.NOT_FOUND:
        return 'The requested data could not be found.';
      case FirebaseErrorType.RATE_LIMIT:
        return 'You\'ve reached the rate limit. Please try again later.';
      case FirebaseErrorType.TIMEOUT:
        return 'The operation timed out. Please try again.';
      case FirebaseErrorType.VALIDATION:
        return 'The data is invalid. Please check your input and try again.';
      default:
        return error.message || 'An unknown error occurred.';
    }
  }
  
  // Handle Firebase errors
  if (error instanceof FirebaseError) {
    const code = error.code;
    return FIREBASE_ERROR_MESSAGES[code] || `Firebase error: ${error.message}`;
  }
  
  // Handle regular errors
  if (error instanceof Error) {
    // Check for network error keywords
    if (error.message.includes('network') || 
        error.message.includes('internet') || 
        error.message.includes('offline') ||
        error.message.includes('connection')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    
    // Check for timeout keywords
    if (error.message.includes('timeout') || 
        error.message.includes('timed out')) {
      return 'The operation timed out. Please try again.';
    }
    
    return error.message;
  }
  
  // Unknown error type
  return 'An unknown error occurred. Please try again.';
}

/**
 * Determine if an error is related to network connectivity
 */
export function isNetworkError(error: FirebaseError | FirebaseServiceError | Error | unknown): boolean {
  if (getNetworkStatus() === NetworkStatus.OFFLINE) {
    return true;
  }
  
  if (error instanceof FirebaseServiceError) {
    return error.type === FirebaseErrorType.NETWORK || error.type === FirebaseErrorType.TIMEOUT;
  }
  
  if (error instanceof FirebaseError) {
    return error.code === FIREBASE_ERROR_CODES.UNAVAILABLE || 
           error.code === FIREBASE_ERROR_CODES.DEADLINE_EXCEEDED;
  }
  
  if (error instanceof Error) {
    return error.message.includes('network') || 
           error.message.includes('internet') || 
           error.message.includes('offline') ||
           error.message.includes('connection') ||
           error.message.includes('timeout') ||
           error.message.includes('timed out');
  }
  
  return false;
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: FirebaseError | FirebaseServiceError | Error | unknown): boolean {
  if (error instanceof FirebaseServiceError) {
    return error.retryable;
  }
  
  if (error instanceof FirebaseError) {
    return error.code === FIREBASE_ERROR_CODES.UNAVAILABLE || 
           error.code === FIREBASE_ERROR_CODES.DEADLINE_EXCEEDED ||
           error.code === FIREBASE_ERROR_CODES.RESOURCE_EXHAUSTED ||
           error.code === FIREBASE_ERROR_CODES.INTERNAL;
  }
  
  return isNetworkError(error);
}