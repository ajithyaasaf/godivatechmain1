import { useState, useEffect } from 'react';

export enum NetworkStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  SLOW = 'slow'
}

// Singleton for network status
let currentNetworkStatus: NetworkStatus = 
  typeof navigator !== 'undefined' && navigator.onLine 
    ? NetworkStatus.ONLINE 
    : NetworkStatus.OFFLINE;

let statusListeners: Array<(status: NetworkStatus) => void> = [];

// Notify all listeners of network status changes
function notifyListeners() {
  statusListeners.forEach(listener => listener(currentNetworkStatus));
}

// Initialize network event listeners (only in browser)
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    currentNetworkStatus = NetworkStatus.ONLINE;
    notifyListeners();
    console.log('Network status: ONLINE');
  });
  
  window.addEventListener('offline', () => {
    currentNetworkStatus = NetworkStatus.OFFLINE;
    notifyListeners();
    console.log('Network status: OFFLINE');
  });
  
  // Check connection quality periodically
  setInterval(() => {
    if (currentNetworkStatus === NetworkStatus.OFFLINE) return;
    
    // Measure connection quality with a simple ping
    const start = Date.now();
    
    fetch('/api/ping', { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    })
      .then(() => {
        const duration = Date.now() - start;
        const prevStatus = currentNetworkStatus;
        
        // If ping takes > 2 seconds, connection is slow
        if (duration > 2000 && prevStatus !== NetworkStatus.SLOW) {
          currentNetworkStatus = NetworkStatus.SLOW;
          notifyListeners();
          console.log(`Network status: SLOW (${duration}ms ping)`);
        } 
        // If ping is fast and we were previously slow, update to online
        else if (duration <= 2000 && prevStatus === NetworkStatus.SLOW) {
          currentNetworkStatus = NetworkStatus.ONLINE;
          notifyListeners();
          console.log(`Network status: ONLINE (${duration}ms ping)`);
        }
      })
      .catch(() => {
        // If ping fails, we might be offline
        // But don't change status as the browser's online/offline events are more reliable
      });
  }, 30000); // Check every 30 seconds
}

/**
 * Hook to monitor network status in components
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(currentNetworkStatus);
  
  useEffect(() => {
    const handleStatusChange = (newStatus: NetworkStatus) => {
      setStatus(newStatus);
    };
    
    // Add listener
    statusListeners.push(handleStatusChange);
    
    // Remove listener on cleanup
    return () => {
      statusListeners = statusListeners.filter(listener => listener !== handleStatusChange);
    };
  }, []);
  
  return status;
}

/**
 * Get the current network status without using the hook
 */
export function getNetworkStatus(): NetworkStatus {
  return currentNetworkStatus;
}

/**
 * Manually set network status (useful for testing)
 */
export function setNetworkStatus(status: NetworkStatus) {
  currentNetworkStatus = status;
  notifyListeners();
}