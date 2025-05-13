import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { FirebaseService, FirebaseErrorType, FirebaseServiceError, firebaseService } from '../lib/firebase-service';
import { useNetworkStatus, NetworkStatus } from './use-network-status';
import { 
  DocumentData, QueryConstraint, orderBy, where, limit, 
  DocumentReference, setDoc, updateDoc, deleteDoc, serverTimestamp,
  collection, doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Constants
const MAX_OFFLINE_QUEUE_SIZE = 100;

// Types
interface FirestoreDocumentOptions {
  enableOfflineSupport?: boolean;
  logErrors?: boolean; 
  showToasts?: boolean;
  triggerAnnouncements?: boolean;
}

interface FirestoreOperationResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
  retry: () => Promise<void>;
}

interface FirestoreCollectionResult<T> extends FirestoreOperationResult<T[]> {
  refresh: () => Promise<void>;
}

interface FirestoreDocumentResult<T> extends FirestoreOperationResult<T> {
  refresh: () => Promise<void>;
}

interface FirestoreMutationResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
}

// Offline queued operations
interface QueuedOperation {
  id: string;
  timestamp: number;
  collection: string;
  operation: 'create' | 'update' | 'delete';
  docId?: string;
  data?: any;
  retries: number;
}

// In-memory queue for offline operations
let offlineOperationsQueue: QueuedOperation[] = [];

// Try to load offline queue from localStorage
try {
  const savedQueue = localStorage.getItem('firestore_offline_queue');
  if (savedQueue) {
    offlineOperationsQueue = JSON.parse(savedQueue);
    console.log(`Loaded ${offlineOperationsQueue.length} offline operations from storage`);
  }
} catch (e) {
  console.error('Error loading offline queue from storage:', e);
}

// Save queue to localStorage
function saveOfflineQueue() {
  try {
    localStorage.setItem('firestore_offline_queue', JSON.stringify(offlineOperationsQueue));
  } catch (e) {
    console.error('Error saving offline queue to storage:', e);
  }
}

// Add operation to offline queue
function queueOfflineOperation(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>) {
  // Generate unique ID for operation
  const opId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Limit queue size - remove oldest if at capacity
  if (offlineOperationsQueue.length >= MAX_OFFLINE_QUEUE_SIZE) {
    offlineOperationsQueue.sort((a, b) => a.timestamp - b.timestamp);
    offlineOperationsQueue.shift(); // Remove oldest
  }
  
  // Add to queue
  const queuedOp: QueuedOperation = {
    ...operation,
    id: opId,
    timestamp: Date.now(),
    retries: 0
  };
  
  offlineOperationsQueue.push(queuedOp);
  saveOfflineQueue();
  
  console.log(`Queued offline operation: ${operation.operation} for ${operation.collection}${operation.docId ? `/${operation.docId}` : ''}`);
  
  return opId;
}

// Process offline queue when online
async function processOfflineQueue(service: FirebaseService): Promise<void> {
  if (offlineOperationsQueue.length === 0) return;
  
  console.log(`Processing ${offlineOperationsQueue.length} offline operations...`);
  
  // Process in order (oldest first)
  offlineOperationsQueue.sort((a, b) => a.timestamp - b.timestamp);
  
  // Keep track of ops to remove after successful processing
  const processedOps: string[] = [];
  const failedOps: string[] = [];
  
  for (const op of offlineOperationsQueue) {
    try {
      console.log(`Processing offline ${op.operation} for ${op.collection}${op.docId ? `/${op.docId}` : ''}`);
      
      // Handle different operation types
      switch (op.operation) {
        case 'create': {
          // For create, we use the auto-generated doc ID or explicitly set one if provided
          if (op.docId) {
            const docRef = doc(db, op.collection, op.docId);
            await setDoc(docRef, {
              ...op.data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          } else {
            // This would use a new auto-generated ID, but we should already have a docId
            console.warn('Create operation missing docId, skipping');
          }
          break;
        }
        
        case 'update': {
          if (!op.docId) {
            console.warn('Update operation missing docId, skipping');
            failedOps.push(op.id);
            continue;
          }
          
          const docRef = doc(db, op.collection, op.docId);
          await updateDoc(docRef, {
            ...op.data,
            updatedAt: serverTimestamp()
          });
          break;
        }
        
        case 'delete': {
          if (!op.docId) {
            console.warn('Delete operation missing docId, skipping');
            failedOps.push(op.id);
            continue;
          }
          
          const docRef = doc(db, op.collection, op.docId);
          await deleteDoc(docRef);
          break;
        }
      }
      
      // If successful, mark for removal
      processedOps.push(op.id);
      
    } catch (error) {
      console.error(`Failed to process offline operation ${op.id}:`, error);
      
      // Increment retry count
      op.retries += 1;
      
      // If too many retries, mark as failed
      if (op.retries >= 3) {
        console.warn(`Offline operation ${op.id} failed after ${op.retries} retries, removing`);
        failedOps.push(op.id);
      }
    }
  }
  
  // Remove processed and failed operations
  if (processedOps.length > 0 || failedOps.length > 0) {
    offlineOperationsQueue = offlineOperationsQueue.filter(
      op => !processedOps.includes(op.id) && !failedOps.includes(op.id)
    );
    saveOfflineQueue();
    
    console.log(`Processed ${processedOps.length} offline operations, ${failedOps.length} failed, ${offlineOperationsQueue.length} remaining`);
  }
}

/**
 * Hook for retrieving a single document with enhanced error handling
 */
export function useFirestoreDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string | null | undefined,
  options: FirestoreDocumentOptions = {}
): FirestoreDocumentResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(documentId !== null && documentId !== undefined);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  const networkStatus = useNetworkStatus();
  const { toast } = useToast();
  
  const {
    enableOfflineSupport = true,
    logErrors = true,
    showToasts = true,
    triggerAnnouncements = false,
  } = options;
  
  const retry = useCallback(async () => {
    if (!documentId) return;
    
    setLoading(true);
    setError(null);
    setRefreshKey(prev => prev + 1);
  }, [documentId]);
  
  const refresh = useCallback(() => retry(), [retry]);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!documentId) {
        if (isMounted) {
          setData(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
      }
      
      try {
        // Check network status first
        if (networkStatus === NetworkStatus.OFFLINE) {
          console.log(`Network is offline, cannot fetch ${collectionName}/${documentId}`);
          // If we have offline support, continue with null data but no error
          if (enableOfflineSupport) {
            if (isMounted) {
              setError(null);
              setLoading(false);
            }
          } else {
            throw new FirebaseServiceError(
              'Cannot fetch data: You are offline',
              FirebaseErrorType.NETWORK
            );
          }
          return;
        }
        
        const result = await firebaseService.getDocument<T>(collectionName, documentId);
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          const err = error as Error;
          const firebaseError = err instanceof FirebaseServiceError 
            ? err 
            : new FirebaseServiceError(
                `Error fetching ${collectionName}/${documentId}: ${err.message}`,
                FirebaseErrorType.UNKNOWN,
                err
              );
          
          setError(firebaseError);
          
          if (logErrors) {
            console.error(`Error fetching document ${documentId} from ${collectionName}:`, err);
          }
          
          if (showToasts) {
            // Only show toast for network errors or permission errors
            if (firebaseError.type === FirebaseErrorType.NETWORK ||
                firebaseError.type === FirebaseErrorType.PERMISSION) {
              toast({
                title: firebaseError.type === FirebaseErrorType.NETWORK 
                  ? 'Network Error' 
                  : 'Permission Error',
                description: firebaseError.message,
                variant: 'destructive',
              });
            }
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [collectionName, documentId, networkStatus, refreshKey, toast, enableOfflineSupport, logErrors, showToasts]);

  return { 
    data, 
    loading, 
    error, 
    isOffline: networkStatus === NetworkStatus.OFFLINE,
    retry,
    refresh
  };
}

/**
 * Hook for retrieving multiple documents with enhanced error handling
 */
export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
  options: FirestoreDocumentOptions = {}
): FirestoreCollectionResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  const networkStatus = useNetworkStatus();
  const { toast } = useToast();
  
  const {
    enableOfflineSupport = true,
    logErrors = true,
    showToasts = true,
    triggerAnnouncements = false,
  } = options;
  
  const retry = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRefreshKey(prev => prev + 1);
  }, []);
  
  const refresh = useCallback(() => retry(), [retry]);
  
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setLoading(true);
      }
      
      try {
        // Check network status first
        if (networkStatus === NetworkStatus.OFFLINE) {
          console.log(`Network is offline, cannot fetch ${collectionName} collection`);
          // If we have offline support, continue with empty data but no error
          if (enableOfflineSupport) {
            if (isMounted) {
              setError(null);
              setLoading(false);
            }
          } else {
            throw new FirebaseServiceError(
              'Cannot fetch data: You are offline',
              FirebaseErrorType.NETWORK
            );
          }
          return;
        }
        
        const result = await firebaseService.queryDocuments<T>(
          collectionName,
          queryConstraints
        );
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          const err = error as Error;
          const firebaseError = err instanceof FirebaseServiceError 
            ? err 
            : new FirebaseServiceError(
                `Error fetching ${collectionName} collection: ${err.message}`,
                FirebaseErrorType.UNKNOWN,
                err
              );
          
          setError(firebaseError);
          
          if (logErrors) {
            console.error(`Error fetching collection ${collectionName}:`, err);
          }
          
          if (showToasts) {
            // Only show toast for network errors or permission errors
            if (firebaseError.type === FirebaseErrorType.NETWORK ||
                firebaseError.type === FirebaseErrorType.PERMISSION) {
              toast({
                title: firebaseError.type === FirebaseErrorType.NETWORK 
                  ? 'Network Error' 
                  : 'Permission Error',
                description: firebaseError.message,
                variant: 'destructive',
              });
            }
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [collectionName, queryConstraints, networkStatus, refreshKey, toast, enableOfflineSupport, logErrors, showToasts]);

  return { 
    data, 
    loading, 
    error, 
    isOffline: networkStatus === NetworkStatus.OFFLINE,
    retry,
    refresh
  };
}

/**
 * Hook to create a document with offline support
 */
export function useFirestoreCreate<T extends DocumentData>(
  collectionName: string,
  options: FirestoreDocumentOptions = {}
): FirestoreMutationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const networkStatus = useNetworkStatus();
  const { toast } = useToast();
  
  const {
    enableOfflineSupport = true,
    logErrors = true,
    showToasts = true,
  } = options;
  
  const execute = useCallback(async (newData: Omit<T, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Handle offline mode
      if (networkStatus === NetworkStatus.OFFLINE) {
        if (!enableOfflineSupport) {
          throw new FirebaseServiceError(
            'Cannot create document: You are offline',
            FirebaseErrorType.NETWORK
          );
        }
        
        // Generate local ID for offline document
        const localId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Add to offline queue
        queueOfflineOperation({
          collection: collectionName,
          operation: 'create',
          docId: localId,
          data: newData
        });
        
        // Create synthetic response
        const offlineData = {
          ...newData,
          id: localId,
          _offlineCreated: true,
          createdAt: new Date(),
          updatedAt: new Date()
        } as T;
        
        setData(offlineData);
        
        if (showToasts) {
          toast({
            title: 'Offline Mode',
            description: 'Document saved locally. It will sync when you go online.',
            variant: 'default',
          });
        }
        
        setLoading(false);
        return offlineData;
      }
      
      // Online mode: process any pending offline operations first
      if (offlineOperationsQueue.length > 0) {
        await processOfflineQueue(firebaseService);
      }
      
      // Create new document
      const docRef = doc(collection(db, collectionName));
      const docId = docRef.id;
      
      // Prepare data with timestamps
      const docData = {
        ...newData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Set the document
      await setDoc(docRef, docData);
      
      // Fetch the created document to get server timestamps
      const createdDoc = await firebaseService.getDocument<T>(collectionName, docId);
      
      setData(createdDoc);
      setLoading(false);
      
      if (showToasts) {
        toast({
          title: 'Document Created',
          description: 'The document was created successfully.',
          variant: 'default',
        });
      }
      
      return createdDoc;
    } catch (error) {
      const err = error as Error;
      const firebaseError = err instanceof FirebaseServiceError 
        ? err 
        : new FirebaseServiceError(
            `Error creating document in ${collectionName}: ${err.message}`,
            FirebaseErrorType.UNKNOWN,
            err
          );
      
      setError(firebaseError);
      
      if (logErrors) {
        console.error(`Error creating document in ${collectionName}:`, err);
      }
      
      if (showToasts) {
        toast({
          title: 'Error Creating Document',
          description: firebaseError.message,
          variant: 'destructive',
        });
      }
      
      setLoading(false);
      return null;
    }
  }, [collectionName, networkStatus, toast, enableOfflineSupport, logErrors, showToasts]);
  
  return { data, loading, error, execute };
}

/**
 * Hook to update a document with offline support
 */
export function useFirestoreUpdate<T extends DocumentData>(
  collectionName: string,
  options: FirestoreDocumentOptions = {}
): FirestoreMutationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const networkStatus = useNetworkStatus();
  const { toast } = useToast();
  
  const {
    enableOfflineSupport = true,
    logErrors = true,
    showToasts = true,
  } = options;
  
  const execute = useCallback(async (docId: string, updateData: Partial<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Handle offline mode
      if (networkStatus === NetworkStatus.OFFLINE) {
        if (!enableOfflineSupport) {
          throw new FirebaseServiceError(
            'Cannot update document: You are offline',
            FirebaseErrorType.NETWORK
          );
        }
        
        // Add to offline queue
        queueOfflineOperation({
          collection: collectionName,
          operation: 'update',
          docId,
          data: updateData
        });
        
        // Create synthetic response - fetch current data first if available
        let currentData: T | null = null;
        try {
          // Try to get from local storage if available
          const localDataKey = `${collectionName}_${docId}`;
          const localData = localStorage.getItem(localDataKey);
          if (localData) {
            currentData = JSON.parse(localData);
          }
        } catch (e) {
          console.warn('Error retrieving local data:', e);
        }
        
        const offlineData = {
          ...currentData,
          ...updateData,
          id: docId,
          _offlineUpdated: true,
          updatedAt: new Date()
        } as T;
        
        // Try to store in local storage for offline reference
        try {
          const localDataKey = `${collectionName}_${docId}`;
          localStorage.setItem(localDataKey, JSON.stringify(offlineData));
        } catch (e) {
          console.warn('Error storing local data:', e);
        }
        
        setData(offlineData);
        
        if (showToasts) {
          toast({
            title: 'Offline Mode',
            description: 'Update saved locally. It will sync when you go online.',
            variant: 'default',
          });
        }
        
        setLoading(false);
        return offlineData;
      }
      
      // Online mode: process any pending offline operations first
      if (offlineOperationsQueue.length > 0) {
        await processOfflineQueue(firebaseService);
      }
      
      // Update document
      const docRef = doc(db, collectionName, docId);
      
      // Prepare data with timestamps
      const docData = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      // Update the document
      await updateDoc(docRef, docData);
      
      // Fetch the updated document to get server timestamps
      const updatedDoc = await firebaseService.getDocument<T>(collectionName, docId);
      
      setData(updatedDoc);
      setLoading(false);
      
      if (showToasts) {
        toast({
          title: 'Document Updated',
          description: 'The document was updated successfully.',
          variant: 'default',
        });
      }
      
      return updatedDoc;
    } catch (error) {
      const err = error as Error;
      const firebaseError = err instanceof FirebaseServiceError 
        ? err 
        : new FirebaseServiceError(
            `Error updating document ${docId} in ${collectionName}: ${err.message}`,
            FirebaseErrorType.UNKNOWN,
            err
          );
      
      setError(firebaseError);
      
      if (logErrors) {
        console.error(`Error updating document ${docId} in ${collectionName}:`, err);
      }
      
      if (showToasts) {
        toast({
          title: 'Error Updating Document',
          description: firebaseError.message,
          variant: 'destructive',
        });
      }
      
      setLoading(false);
      return null;
    }
  }, [collectionName, networkStatus, toast, enableOfflineSupport, logErrors, showToasts]);
  
  return { data, loading, error, execute };
}

/**
 * Hook to delete a document with offline support
 */
export function useFirestoreDelete(
  collectionName: string,
  options: FirestoreDocumentOptions = {}
): FirestoreMutationResult<boolean> {
  const [data, setData] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const networkStatus = useNetworkStatus();
  const { toast } = useToast();
  
  const {
    enableOfflineSupport = true,
    logErrors = true,
    showToasts = true,
  } = options;
  
  const execute = useCallback(async (docId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Handle offline mode
      if (networkStatus === NetworkStatus.OFFLINE) {
        if (!enableOfflineSupport) {
          throw new FirebaseServiceError(
            'Cannot delete document: You are offline',
            FirebaseErrorType.NETWORK
          );
        }
        
        // Add to offline queue
        queueOfflineOperation({
          collection: collectionName,
          operation: 'delete',
          docId,
        });
        
        // Try to remove from local storage
        try {
          const localDataKey = `${collectionName}_${docId}`;
          localStorage.removeItem(localDataKey);
        } catch (e) {
          console.warn('Error removing local data:', e);
        }
        
        setData(true);
        
        if (showToasts) {
          toast({
            title: 'Offline Mode',
            description: 'Delete operation saved locally. It will sync when you go online.',
            variant: 'default',
          });
        }
        
        setLoading(false);
        return true;
      }
      
      // Online mode: process any pending offline operations first
      if (offlineOperationsQueue.length > 0) {
        await processOfflineQueue(firebaseService);
      }
      
      // Delete document
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      
      setData(true);
      setLoading(false);
      
      if (showToasts) {
        toast({
          title: 'Document Deleted',
          description: 'The document was deleted successfully.',
          variant: 'default',
        });
      }
      
      return true;
    } catch (error) {
      const err = error as Error;
      const firebaseError = err instanceof FirebaseServiceError 
        ? err 
        : new FirebaseServiceError(
            `Error deleting document ${docId} in ${collectionName}: ${err.message}`,
            FirebaseErrorType.UNKNOWN,
            err
          );
      
      setError(firebaseError);
      
      if (logErrors) {
        console.error(`Error deleting document ${docId} in ${collectionName}:`, err);
      }
      
      if (showToasts) {
        toast({
          title: 'Error Deleting Document',
          description: firebaseError.message,
          variant: 'destructive',
        });
      }
      
      setLoading(false);
      return false;
    }
  }, [collectionName, networkStatus, toast, enableOfflineSupport, logErrors, showToasts]);
  
  return { data, loading, error, execute };
}

// Set up listeners for online/offline status to process queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Online status detected, processing offline queue...');
    processOfflineQueue(firebaseService).catch(err => {
      console.error('Error processing offline queue:', err);
    });
  });
}