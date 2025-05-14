/**
 * Performance Optimization Utilities
 * 
 * This module provides utilities for improving application performance:
 * - Lazy loading and code splitting
 * - Resource prioritization
 * - CSS optimization
 * - Resource preloading
 */

/**
 * Critical CSS and JS resources that should be preloaded
 */
const CRITICAL_RESOURCES = [
  { type: 'style', href: '/src/index.css' },
  // Add critical scripts if needed
];

/**
 * Preload critical resources for initial page load
 */
export function preloadCriticalResources(): void {
  CRITICAL_RESOURCES.forEach(resource => {
    const linkEl = document.createElement('link');
    linkEl.rel = 'preload';
    linkEl.href = resource.href;
    linkEl.as = resource.type;
    linkEl.crossOrigin = 'anonymous';
    document.head.appendChild(linkEl);
  });
}

/**
 * Dynamically load non-critical JavaScript
 * @param src Script URL to load
 * @param defer Whether to defer execution
 * @returns Promise that resolves when script is loaded
 */
export function loadScript(src: string, defer = true): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = defer;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

/**
 * Lazy load a component only when it's needed
 * @param componentPath Path to the component to lazy load
 * @returns A promise that resolves with the loaded component
 */
export function lazyLoadComponent(componentPath: string): Promise<any> {
  return import(/* @vite-ignore */ componentPath);
}

/**
 * Optimizes the loading of third-party resources
 * @param resource Resource URL
 * @param type Resource type (script, style, font, etc.)
 * @param options Additional loading options
 */
export function optimizeThirdPartyLoading(
  resource: string, 
  type: 'script' | 'style' | 'font', 
  options?: { async?: boolean; defer?: boolean; crossOrigin?: string }
): void {
  if (type === 'script') {
    const script = document.createElement('script');
    script.src = resource;
    script.async = options?.async ?? true;
    script.defer = options?.defer ?? true;
    if (options?.crossOrigin) script.crossOrigin = options.crossOrigin;
    document.body.appendChild(script);
  } else if (type === 'style') {
    const link = document.createElement('link');
    link.href = resource;
    link.rel = 'stylesheet';
    if (options?.crossOrigin) link.crossOrigin = options.crossOrigin;
    document.head.appendChild(link);
  } else if (type === 'font') {
    const link = document.createElement('link');
    link.href = resource;
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = options?.crossOrigin ?? 'anonymous';
    document.head.appendChild(link);
  }
}

/**
 * Track long tasks to identify performance bottlenecks
 * @param callback Function to call when a long task is detected
 */
export function trackLongTasks(callback: (duration: number) => void): void {
  // Use PerformanceObserver to track long tasks if supported
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // @ts-ignore - PerformanceLongTaskTiming not in standard TS DOM types
          callback(entry.duration);
        });
      });
      
      // Start observing long task notifications
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.error('Long task tracking not supported', e);
    }
  }
}

/**
 * Split a heavy computation into smaller chunks to prevent blocking the main thread
 * @param items Items to process
 * @param processFn Function to process each chunk
 * @param chunkSize Number of items to process per chunk
 */
export function processInChunks<T, R>(
  items: T[],
  processFn: (chunk: T[]) => R,
  chunkSize = 5
): void {
  let index = 0;
  
  function processNextChunk() {
    const chunk = items.slice(index, index + chunkSize);
    if (chunk.length === 0) return;
    
    // Process the chunk
    processFn(chunk);
    
    // Move to the next chunk
    index += chunkSize;
    
    // Schedule the next chunk with requestIdleCallback or setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => processNextChunk());
    } else {
      setTimeout(processNextChunk, 1);
    }
  }
  
  // Start processing
  processNextChunk();
}

/**
 * Debounce a function to limit how often it can be called
 * Useful for expensive UI operations triggered by user input
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Create an optimized intersection observer for lazy-loading elements
 * @param callback Function to call when elements intersect
 * @param options IntersectionObserver options
 * @returns IntersectionObserver instance
 */
export function createLazyLoadObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '200px 0px', // Start loading before element is visible
    threshold: 0.01,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}