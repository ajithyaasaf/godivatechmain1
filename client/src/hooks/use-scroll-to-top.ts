import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook to automatically scroll to the top when the route changes with smooth animation
 */
export const useScrollToTop = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    // Smooth scroll to the top of the page whenever the location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);
  
  return null;
};