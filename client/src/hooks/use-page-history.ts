import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook to track page navigation history and store it in session storage
 * Used by the 404 page to offer a "Go Back" option to the last valid page
 */
export function usePageHistory() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Don't track 404 pages or non-existent routes
    if (location !== '/404' && !location.includes('undefined')) {
      // Store current page as the previous page before navigating away
      try {
        sessionStorage.setItem('lastVisitedPage', location);
      } catch (error) {
        console.error('Failed to store page in session storage:', error);
      }
    }
  }, [location]);
  
  return null; // This hook doesn't return anything, it just has side effects
}