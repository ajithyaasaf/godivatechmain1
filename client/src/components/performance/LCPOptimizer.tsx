import { useEffect } from 'react';
import { trackLCP } from '@/lib/lcp-optimization';
import { initResourcePrefetching } from '@/lib/resource-prefetch';

/**
 * LCPOptimizer - A component that handles LCP (Largest Contentful Paint) optimization
 * 
 * This component should be mounted at the root level to initialize performance optimizations
 * early in the application lifecycle.
 */
const LCPOptimizer: React.FC = () => {
  useEffect(() => {
    // Track LCP for performance monitoring
    trackLCP();
    
    // Initialize resource prefetching
    initResourcePrefetching();

    // Add minimal critical CSS that doesn't affect colors
    const style = document.createElement('style');
    style.textContent = `
      /* Basic LCP optimization that doesn't affect colors */
      img[data-above-fold="true"] {
        content-visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
    
    // Add native lazy loading to non-critical images
    document.querySelectorAll('img:not([data-above-fold="true"])')
      .forEach(img => {
        if (img instanceof HTMLImageElement) {
          img.loading = 'lazy';
        }
      });
      
    // Modify resource loading priorities
    adjustResourcePriorities();
    
    return () => {
      // Remove inline critical CSS on unmount
      document.head.removeChild(style);
    };
  }, []);
  
  return null; // This is a utility component with no visible UI
};

/**
 * Adjust loading priorities for resources
 */
function adjustResourcePriorities() {
  // Find all stylesheets and adjust their loading priority
  document.querySelectorAll('link[rel="stylesheet"]')
    .forEach(link => {
      if (link instanceof HTMLLinkElement) {
        // Main stylesheet should load with high priority
        if (link.href.includes('index.css')) {
          link.setAttribute('fetchpriority', 'high');
        } else {
          // Other stylesheets can be lower priority
          link.setAttribute('fetchpriority', 'low');
        }
      }
    });
    
  // Reduce priority of non-critical scripts
  document.querySelectorAll('script:not([critical])')
    .forEach(script => {
      if (script instanceof HTMLScriptElement) {
        // Make non-critical scripts async
        script.async = true;
      }
    });
}

export default LCPOptimizer;