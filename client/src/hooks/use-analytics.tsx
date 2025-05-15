import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { initGA, trackPageView, seoTracking } from '../lib/analytics';

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
  const [initialized, setInitialized] = useState(false);
  
  // Initialize Google Analytics once
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else if (!initialized) {
      initGA();
      setInitialized(true);
    }
  }, [initialized]);
  
  // Track page views whenever the route changes
  useEffect(() => {
    if (!initialized) return;
    
    if (location !== prevLocationRef.current) {
      // Calculate page title based on current page
      let pageTitle = document.title;
      
      // Default title if document.title is empty
      if (!pageTitle) {
        const pagePath = location.split('/').filter(Boolean).pop() || 'home';
        const formattedPageName = pagePath
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        pageTitle = `${formattedPageName} | GodivaTech`;
      }
      
      // Track the page view
      trackPageView(location, pageTitle);
      prevLocationRef.current = location;
      
      // Track SEO metrics for the page
      setTimeout(() => {
        seoTracking.trackCanonicalUsage();
        seoTracking.trackMetaTagStatus();
        
        // Check for structured data
        const structuredDataElements = document.querySelectorAll('script[type="application/ld+json"]');
        structuredDataElements.forEach(el => {
          try {
            const data = JSON.parse(el.textContent || '{}');
            if (data['@type']) {
              seoTracking.trackStructuredDataImpression(data['@type']);
            }
          } catch (e) {
            // Ignore parsing errors
          }
        });
      }, 1000); // Small delay to ensure page is fully rendered
    }
  }, [location, initialized]);
  
  // Track scroll depth
  useEffect(() => {
    if (!initialized) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Calculate how far down the page the user has scrolled
      const scrollPercent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      
      // Track scroll depth at certain thresholds
      if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
        import('../lib/analytics').then(({ trackScrollDepth }) => {
          trackScrollDepth(scrollPercent);
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initialized]);
  
  return { initialized };
};