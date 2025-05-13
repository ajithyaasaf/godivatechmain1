import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseService } from '../../lib/firebase-service';
import { useNetworkStatus, NetworkStatus } from '../../hooks/use-network-status';
import { AlertCircle, Loader2, WifiOff } from 'lucide-react';

// Context for Firebase data fetching state
interface FirebaseDataContextType {
  isOnline: boolean;
  networkStatus: NetworkStatus;
  isConnecting: boolean;
  lastSyncTime: Date | null;
  offlineQueueSize: number;
  processingQueue: boolean;
  refreshConnectionStatus: () => void;
}

const FirebaseDataContext = createContext<FirebaseDataContextType | null>(null);

// Props for the provider component
interface FirebaseDataProviderProps {
  children: React.ReactNode;
  showStatusIndicator?: boolean;
  offlineMessage?: string;
  slowConnectionMessage?: string;
}

/**
 * Provider component that manages Firebase connection state and offline queue
 */
export const FirebaseDataProvider: React.FC<FirebaseDataProviderProps> = ({
  children,
  showStatusIndicator = true,
  offlineMessage = "You're currently offline. Some data may not be available.",
  slowConnectionMessage = "Slow connection detected. Data loading may take longer.",
}) => {
  const networkStatus = useNetworkStatus();
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [offlineQueueSize, setOfflineQueueSize] = useState(0);
  const [processingQueue, setProcessingQueue] = useState(false);
  
  // Function to check and update offline queue status
  const checkOfflineQueue = () => {
    try {
      const queueData = localStorage.getItem('firestore_offline_queue');
      if (queueData) {
        const queue = JSON.parse(queueData);
        setOfflineQueueSize(Array.isArray(queue) ? queue.length : 0);
      } else {
        setOfflineQueueSize(0);
      }
    } catch (e) {
      console.error('Error checking offline queue:', e);
      setOfflineQueueSize(0);
    }
  };
  
  // Function to force refresh connection status
  const refreshConnectionStatus = () => {
    setIsConnecting(true);
    
    // Ping server to check connection
    fetch('/api/ping', { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(() => {
        // Process offline queue if we're online now
        if (networkStatus !== NetworkStatus.OFFLINE && offlineQueueSize > 0) {
          setProcessingQueue(true);
          
          // Process queue with a slight delay to allow UI to update
          setTimeout(() => {
            // This would typically be handled by the actual implementation
            // in real code, we'd call processOfflineQueue from the firebaseService
            
            // For now, just simulate processing
            setTimeout(() => {
              setOfflineQueueSize(0);
              setProcessingQueue(false);
              setLastSyncTime(new Date());
            }, 1500);
          }, 500);
        } else {
          setLastSyncTime(new Date());
        }
      })
      .catch(() => {
        // Connection failed, do nothing special
      })
      .finally(() => {
        setIsConnecting(false);
      });
  };
  
  // Listen for network status changes
  useEffect(() => {
    // Update queue status when network status changes
    checkOfflineQueue();
    
    // If transitioning from offline to online, refresh connection
    if (networkStatus !== NetworkStatus.OFFLINE) {
      refreshConnectionStatus();
    }
  }, [networkStatus]);
  
  // Check offline queue periodically
  useEffect(() => {
    const interval = setInterval(checkOfflineQueue, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Context value
  const contextValue: FirebaseDataContextType = {
    isOnline: networkStatus !== NetworkStatus.OFFLINE,
    networkStatus,
    isConnecting,
    lastSyncTime,
    offlineQueueSize,
    processingQueue,
    refreshConnectionStatus
  };
  
  return (
    <FirebaseDataContext.Provider value={contextValue}>
      {showStatusIndicator && (
        <>
          {networkStatus === NetworkStatus.OFFLINE && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <WifiOff className="h-5 w-5 mr-2" />
                </div>
                <div>
                  <p className="font-bold">Offline</p>
                  <p>{offlineMessage}</p>
                  {offlineQueueSize > 0 && (
                    <p className="mt-1">
                      {offlineQueueSize} operation{offlineQueueSize !== 1 ? 's' : ''} queued for sync.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {networkStatus === NetworkStatus.SLOW && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 mr-2" />
                </div>
                <div>
                  <p className="font-bold">Slow Connection</p>
                  <p>{slowConnectionMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {processingQueue && (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded" role="alert">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                </div>
                <div>
                  <p className="font-bold">Syncing Data</p>
                  <p>Processing offline changes...</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {children}
    </FirebaseDataContext.Provider>
  );
};

/**
 * Hook to use Firebase data context
 */
export function useFirebaseData() {
  const context = useContext(FirebaseDataContext);
  if (!context) {
    throw new Error('useFirebaseData must be used within a FirebaseDataProvider');
  }
  return context;
}