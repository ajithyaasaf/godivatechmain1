/**
 * Resource Prefetching Utilities
 * 
 * This module provides tools to prefetch critical resources
 * to improve Largest Contentful Paint (LCP) time.
 */

/**
 * Add resource hints to the document
 * @param resources Array of resources to prefetch
 */
export function addResourceHints(resources: Array<{
  url: string,
  type: 'prefetch' | 'preload' | 'preconnect' | 'dns-prefetch',
  as?: string,
  crossOrigin?: string,
  importance?: 'high' | 'low' | 'auto'
}>): void {
  if (typeof document === 'undefined') return;

  resources.forEach(({ url, type, as, crossOrigin, importance }) => {
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${url}"][rel="${type}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = type;
    link.href = url;
    
    if (as) link.setAttribute('as', as);
    if (crossOrigin) link.crossOrigin = crossOrigin;
    if (importance) link.setAttribute('importance', importance);
    
    document.head.appendChild(link);
  });
}

/**
 * Prefetch critical API endpoints
 */
export function prefetchCriticalAPIs(): void {
  const criticalAPIs = [
    '/api/services',
    '/api/projects',
    '/api/team-members'
  ];
  
  criticalAPIs.forEach(apiPath => {
    addResourceHints([{
      url: apiPath,
      type: 'prefetch',
      importance: 'high'
    }]);
  });
}

/**
 * Preconnect to third-party domains
 */
export function preconnectThirdParties(): void {
  const thirdPartyDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://res.cloudinary.com'
  ];
  
  thirdPartyDomains.forEach(domain => {
    addResourceHints([{
      url: domain,
      type: 'preconnect',
      crossOrigin: 'anonymous'
    }]);
  });
  
  // DNS prefetch for additional domains
  addResourceHints([{
    url: 'https://firestore.googleapis.com',
    type: 'dns-prefetch'
  }]);
}

/**
 * Preload critical CSS files
 */
export function preloadCriticalCSS(): void {
  const criticalCSSFiles = [
    '/src/index.css'
  ];
  
  criticalCSSFiles.forEach(cssPath => {
    addResourceHints([{
      url: cssPath,
      type: 'preload',
      as: 'style'
    }]);
  });
}

/**
 * Initiate all resource prefetching strategies
 */
export function initResourcePrefetching(): void {
  preconnectThirdParties();
  preloadCriticalCSS();
  
  // Wait a bit before prefetching APIs to prioritize render
  setTimeout(() => {
    prefetchCriticalAPIs();
  }, 100);
}