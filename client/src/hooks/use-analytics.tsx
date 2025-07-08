import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { initGA, trackPageView, seoTracking, trackTimeOnPage, trackScrollDepth } from '@/lib/analytics';

/**
 * Custom hook for analytics tracking in GodivaTech website
 * 
 * This hook handles:
 * 1. Google Analytics initialization
 * 2. Automatic page view tracking on route changes
 * 3. SEO metrics tracking
 * 4. Scroll depth tracking
 */
export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const gaInitializedRef = useRef<boolean>(false);
  
  // Initialize Google Analytics
  useEffect(() => {
    if (!gaInitializedRef.current) {
      // Initialize Google Analytics
      initGA();
      
      // Start tracking time on page
      trackTimeOnPage();
      
      // Track Core Web Vitals for SEO
      seoTracking.trackCoreWebVitals();
      
      // Set up scroll depth tracking
      const handleScroll = () => {
        if (!document.body) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;
        
        // Calculate scroll percentage
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        trackScrollDepth(scrollPercent);
      };
      
      // Throttle scroll events for better performance
      let scrollTimeout: ReturnType<typeof setTimeout>;
      window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 500);
      });
      
      gaInitializedRef.current = true;
    }
  }, []);
  
  // Track page views when location changes
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      // Track page view in Google Analytics
      trackPageView(location, document.title);
      
      // Update reference for comparison
      prevLocationRef.current = location;
    }
  }, [location]);
  
  return null;
};