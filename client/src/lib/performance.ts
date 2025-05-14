/**
 * Performance optimization utilities for Core Web Vitals
 */

/**
 * Track long-running tasks that may cause poor user experience
 * This helps identify performance bottlenecks
 * 
 * @param callback Callback function that receives the duration of long tasks
 * @param threshold Minimum duration (ms) to consider a task as "long"
 */
export function trackLongTasks(callback: (duration: number) => void, threshold: number = 50) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // duration is in milliseconds
        const duration = entry.duration;
        
        if (duration > threshold) {
          callback(duration);
        }
      });
    });
    
    observer.observe({ entryTypes: ['longtask'] });
    
    return () => {
      observer.disconnect();
    };
  } catch (error) {
    console.error('Error setting up long task observer:', error);
  }
}

/**
 * Lazy load images that are not in the viewport
 * This helps improve Largest Contentful Paint (LCP) by prioritizing visible images
 * 
 * @param imageSelector CSS selector for images to lazy load
 */
export function setupLazyLoading(imageSelector: string = 'img:not([loading])') {
  if (typeof window === 'undefined') return;
  
  // Add loading="lazy" to images that don't already have it
  const images = document.querySelectorAll<HTMLImageElement>(imageSelector);
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    
    // Add decoding="async" for better performance
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
  });
}

/**
 * Preload critical resources
 * This helps improve First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
 * 
 * @param resources Array of URLs to preload
 * @param type Resource type (image, style, script, font)
 */
export function preloadCriticalResources(resources: string[], type: 'image' | 'style' | 'script' | 'font' = 'image') {
  if (typeof window === 'undefined') return;
  
  resources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'font') {
      link.setAttribute('crossorigin', 'anonymous');
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Optimize images on the page for better performance
 * This helps improve Largest Contentful Paint (LCP)
 */
export function optimizeImages() {
  if (typeof window === 'undefined') return;
  
  const images = document.querySelectorAll<HTMLImageElement>('img');
  
  images.forEach(img => {
    // Skip images that are already optimized
    if (img.getAttribute('data-optimized') === 'true') return;
    
    // Add width and height attributes to prevent layout shifts
    if (img.width && img.height && !img.hasAttribute('width') && !img.hasAttribute('height')) {
      img.setAttribute('width', img.width.toString());
      img.setAttribute('height', img.height.toString());
    }
    
    // Mark as optimized
    img.setAttribute('data-optimized', 'true');
  });
}

/**
 * Defer non-critical JavaScript
 * This helps improve Time to Interactive (TTI) and Total Blocking Time (TBT)
 * 
 * @param callback Function to defer
 * @param timeout Delay in milliseconds
 */
export function deferNonCritical(callback: () => void, timeout: number = 1000) {
  if (typeof window === 'undefined') return;
  
  if ('requestIdleCallback' in window) {
    // Use requestIdleCallback when browser is idle
    (window as any).requestIdleCallback(() => {
      setTimeout(callback, 0);
    });
  } else {
    // Fallback to setTimeout
    setTimeout(callback, timeout);
  }
}

/**
 * Register a performance observer to monitor Core Web Vitals metrics
 * This helps track LCP, FID, and CLS in production
 */
export function monitorWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;
  
  try {
    // LCP observer
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    
    // FID observer
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const delay = (entry as any).processingStart - entry.startTime;
        console.log('FID:', delay);
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });
    
    // CLS observer
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      const entries = entryList.getEntries();
      
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.error('Error setting up performance observers:', error);
  }
}

/**
 * Initialize all performance optimizations
 * Call this function once in your app's entry point
 */
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return;
  
  // Wait for page to be fully loaded
  if (document.readyState === 'complete') {
    performOptimizations();
  } else {
    window.addEventListener('load', performOptimizations);
  }
  
  function performOptimizations() {
    // Add lazy loading to images
    setupLazyLoading();
    
    // Optimize images to prevent CLS
    optimizeImages();
    
    // Defer non-critical operations
    deferNonCritical(() => {
      // Add analytics, non-essential scripts, etc. here
      monitorWebVitals();
    });
    
    // Preload hero image for better LCP
    if (window.location.pathname === '/' || window.location.pathname === '/home') {
      preloadCriticalResources(['/hero-image.jpg'], 'image');
    }
  }
}