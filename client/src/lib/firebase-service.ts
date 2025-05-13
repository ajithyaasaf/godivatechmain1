import { 
  collection, doc, getDoc, getDocs, 
  query, where, orderBy, limit,
  QueryConstraint, DocumentData,
  CollectionReference, DocumentReference,
  DocumentSnapshot,
  Firestore
} from "firebase/firestore";
import { db } from "./firebase";
import { NetworkStatus, useNetworkStatus } from "../hooks/use-network-status";

// Constants for retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

/**
 * Error types for more specific error handling
 */
export enum FirebaseErrorType {
  NETWORK = "network",
  PERMISSION = "permission",
  NOT_FOUND = "not_found",
  RATE_LIMIT = "rate_limit",
  TIMEOUT = "timeout",
  VALIDATION = "validation",
  UNKNOWN = "unknown"
}

/**
 * Custom error class for Firebase operations
 */
export class FirebaseServiceError extends Error {
  type: FirebaseErrorType;
  originalError?: Error;
  retryable: boolean;
  
  constructor(
    message: string, 
    type: FirebaseErrorType = FirebaseErrorType.UNKNOWN, 
    originalError?: Error,
    retryable = true
  ) {
    super(message);
    this.name = "FirebaseServiceError";
    this.type = type;
    this.originalError = originalError;
    this.retryable = retryable;
  }
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: any): boolean {
  // Network errors are generally retryable
  if (error?.code === 'unavailable' || 
      error?.code === 'deadline-exceeded' ||
      error?.message?.includes('network') || 
      error?.message?.includes('timeout')) {
    return true;
  }
  
  // Permission errors and not found errors are not retryable
  if (error?.code === 'permission-denied' || 
      error?.code === 'not-found' ||
      error?.code === 'invalid-argument') {
    return false;
  }
  
  // Rate limiting errors are retryable but with backoff
  if (error?.code === 'resource-exhausted') {
    return true;
  }
  
  // Default to retryable for unknown errors
  return true;
}

/**
 * Categorize Firebase errors into specific types
 */
function categorizeFirebaseError(error: any): FirebaseErrorType {
  const errorCode = error?.code;
  const errorMessage = error?.message || '';
  
  // Network related errors
  if (errorCode === 'unavailable' || 
      errorMessage.includes('network') ||
      errorMessage.includes('connect') ||
      errorMessage.includes('offline')) {
    return FirebaseErrorType.NETWORK;
  }
  
  // Permission errors
  if (errorCode === 'permission-denied' ||
      errorCode === 'unauthenticated' ||
      errorMessage.includes('permission') ||
      errorMessage.includes('unauthorized')) {
    return FirebaseErrorType.PERMISSION;
  }
  
  // Not found errors
  if (errorCode === 'not-found' ||
      errorMessage.includes('not found') ||
      errorMessage.includes('does not exist')) {
    return FirebaseErrorType.NOT_FOUND;
  }
  
  // Rate limit errors
  if (errorCode === 'resource-exhausted' ||
      errorMessage.includes('quota') ||
      errorMessage.includes('rate limit')) {
    return FirebaseErrorType.RATE_LIMIT;
  }
  
  // Timeout errors
  if (errorCode === 'deadline-exceeded' ||
      errorMessage.includes('timeout')) {
    return FirebaseErrorType.TIMEOUT;
  }
  
  // Validation errors
  if (errorCode === 'invalid-argument' ||
      errorMessage.includes('invalid') ||
      errorMessage.includes('validation')) {
    return FirebaseErrorType.VALIDATION;
  }
  
  // Default to unknown
  return FirebaseErrorType.UNKNOWN;
}

/**
 * Calculate exponential backoff duration with jitter
 */
function calculateBackoff(attempt: number): number {
  // Exponential backoff: 2^attempt * baseDelay
  const exponentialDelay = Math.min(
    MAX_RETRY_DELAY,
    INITIAL_RETRY_DELAY * Math.pow(2, attempt)
  );
  
  // Add jitter (±30% randomization) to prevent thundering herd
  const jitter = (Math.random() * 0.6 - 0.3); // -30% to +30%
  const delay = exponentialDelay * (1 + jitter);
  
  return Math.min(MAX_RETRY_DELAY, Math.max(INITIAL_RETRY_DELAY, delay));
}

/**
 * Wait for the specified milliseconds
 */
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Circuit breaker state (shared across instances)
 */
type CircuitBreakerState = {
  failures: number;
  lastFailureTime: number;
  state: 'closed' | 'open' | 'half-open';
};

const circuitBreakers: Record<string, CircuitBreakerState> = {};

/**
 * Check if the circuit breaker allows operation
 */
function checkCircuitBreaker(operationKey: string): boolean {
  // Initialize circuit breaker if it doesn't exist
  if (!circuitBreakers[operationKey]) {
    circuitBreakers[operationKey] = {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed',
    };
    return true;
  }
  
  const breaker = circuitBreakers[operationKey];
  const now = Date.now();
  
  // Reset failure count after 5 minutes
  if (now - breaker.lastFailureTime > 5 * 60 * 1000) {
    breaker.failures = 0;
    breaker.state = 'closed';
    return true;
  }
  
  // If circuit is open, check if we should try half-open
  if (breaker.state === 'open') {
    // Try half-open after 30 seconds
    if (now - breaker.lastFailureTime > 30 * 1000) {
      breaker.state = 'half-open';
      return true;
    }
    return false;
  }
  
  return true;
}

/**
 * Record operation success/failure for circuit breaker
 */
function recordOperationResult(operationKey: string, success: boolean): void {
  if (!circuitBreakers[operationKey]) {
    circuitBreakers[operationKey] = {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed',
    };
  }
  
  const breaker = circuitBreakers[operationKey];
  
  if (success) {
    // On success in half-open state, close the circuit
    if (breaker.state === 'half-open') {
      breaker.state = 'closed';
      breaker.failures = 0;
    }
  } else {
    // On failure, increment counter and update time
    breaker.failures++;
    breaker.lastFailureTime = Date.now();
    
    // If too many failures, open the circuit
    if (breaker.failures >= 5) {
      breaker.state = 'open';
    }
  }
}

/**
 * Retry operation with exponential backoff
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: any;
  
  // Check circuit breaker first
  const circuitKey = `firebase:${operationName}`;
  if (!checkCircuitBreaker(circuitKey)) {
    console.error(`Circuit breaker open for operation: ${operationName}`);
    throw new FirebaseServiceError(
      `Service temporarily unavailable (circuit open): ${operationName}`,
      FirebaseErrorType.NETWORK,
      undefined,
      false
    );
  }
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      // Record successful operation
      recordOperationResult(circuitKey, true);
      return result;
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed for ${operationName}:`, error);
      
      // Determine if we should retry
      const errorType = categorizeFirebaseError(error);
      const retryable = isRetryableError(error);
      
      // Record failed operation
      recordOperationResult(circuitKey, false);
      
      // If not retryable or last attempt, throw
      if (!retryable || attempt === maxRetries) {
        throw new FirebaseServiceError(
          `Firebase operation failed after ${attempt + 1} attempts: ${error.message || error}`,
          errorType,
          error,
          retryable
        );
      }
      
      // Wait before retrying with exponential backoff
      const backoffTime = calculateBackoff(attempt);
      console.log(`Retrying ${operationName} in ${Math.round(backoffTime)}ms...`);
      await wait(backoffTime);
    }
  }
  
  // This shouldn't happen but TypeScript needs it
  throw lastError;
}

/**
 * A service wrapper for Firebase Firestore operations with enhanced error handling and retries
 */
export class FirebaseService {
  private db: Firestore;
  
  constructor(firestore: Firestore = db) {
    this.db = firestore;
  }
  
  /**
   * Get a single document with retry logic
   */
  async getDocument<T>(
    collectionName: string, 
    docId: string
  ): Promise<T | null> {
    const operationName = `getDocument(${collectionName}, ${docId})`;
    
    return retryOperation(async () => {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return { id: docId, ...docSnap.data() } as T;
    }, operationName);
  }
  
  /**
   * Query documents with retry logic
   */
  async queryDocuments<T>(
    collectionName: string,
    queryConstraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const constraintsStr = queryConstraints.map(c => c.toString()).join(', ');
    const operationName = `queryDocuments(${collectionName}, [${constraintsStr}])`;
    
    return retryOperation(async () => {
      const collectionRef = collection(this.db, collectionName);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    }, operationName);
  }
  
  /**
   * Get all documents in a collection with ordering
   */
  async getAllDocuments<T>(
    collectionName: string,
    orderByField: string = 'createdAt',
    direction: 'asc' | 'desc' = 'desc'
  ): Promise<T[]> {
    const operationName = `getAllDocuments(${collectionName})`;
    
    return this.queryDocuments<T>(
      collectionName,
      [orderBy(orderByField, direction)]
    );
  }
  
  /**
   * Query single document by field value
   */
  async getDocumentByField<T>(
    collectionName: string,
    fieldName: string,
    fieldValue: any
  ): Promise<T | null> {
    const operationName = `getDocumentByField(${collectionName}, ${fieldName}, ${fieldValue})`;
    
    return retryOperation(async () => {
      const collectionRef = collection(this.db, collectionName);
      const q = query(
        collectionRef,
        where(fieldName, '==', fieldValue),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as T;
    }, operationName);
  }
}

// Singleton instance
export const firebaseService = new FirebaseService();

// Hook for components to access Firebase with network status
export function useFirebaseService() {
  const networkStatus = useNetworkStatus();
  
  return {
    firebaseService,
    networkStatus,
    isOnline: networkStatus === NetworkStatus.ONLINE
  };
}