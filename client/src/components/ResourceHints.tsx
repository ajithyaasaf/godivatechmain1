import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * ResourceHints Component
 * 
 * This component adds modern resource hints to improve page loading performance:
 * - Preconnect: Establish early connections to important domains
 * - Preload: Load critical resources before they're discovered by the browser
 * - Prefetch: Grab resources likely needed for subsequent navigation
 * - DNS-Prefetch: Resolve DNS for domains that will be used soon
 */
const ResourceHints: React.FC = () => {
  // Monitor resource load timing for performance optimization
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'performance' in window) {
      try {
        // Use PerformanceObserver to monitor resource loading
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          // Log slow resources (taking > 1s to load)
          entries.forEach(entry => {
            if (entry.duration > 1000) {
              console.warn(`Slow resource load: ${entry.name} (${Math.round(entry.duration)}ms)`);
            }
          });
        });
        
        // Start observing resource timing entries
        observer.observe({ entryTypes: ['resource'] });
        
        return () => observer.disconnect();
      } catch (e) {
        console.error('Performance monitoring not supported', e);
      }
    }
    
    // Manually add the high priority resource preloading
    // This avoids TypeScript issues with the fetchpriority attribute
    const preloadLogo = document.createElement('link');
    preloadLogo.rel = 'preload';
    preloadLogo.href = '/src/assets/godiva-logo.png';
    preloadLogo.as = 'image';
    preloadLogo.type = 'image/png';
    // @ts-ignore - fetchpriority is valid HTML but not in all TS types yet
    preloadLogo.fetchpriority = 'high';
    document.head.appendChild(preloadLogo);
  }, []);
  
  return (
    <Helmet>
      {/* Preconnect to critical domains - establishes early connections */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://firebasestorage.googleapis.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch for domains we'll use later - resolves DNS early */}
      <link rel="dns-prefetch" href="https://api.fontshare.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="dns-prefetch" href="https://randomuser.me" />
      
      {/* Prefetch templates for pages the user is likely to visit next */}
      <link 
        rel="prefetch" 
        href="/src/pages/About.tsx" 
        as="script" 
      />
      <link 
        rel="prefetch" 
        href="/src/pages/Services.tsx" 
        as="script" 
      />
      
      {/* Add modulepreload for critical JS modules */}
      <link 
        rel="modulepreload" 
        href="/src/components/Header.tsx" 
      />
      <link 
        rel="modulepreload" 
        href="/src/components/Footer.tsx" 
      />
      
      {/* Set priority hints for critical rendering */}
      <meta name="rendering-critical-resources" content="/src/index.css" />
    </Helmet>
  );
};

export default ResourceHints;