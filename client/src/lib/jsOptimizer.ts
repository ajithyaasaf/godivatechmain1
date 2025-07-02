/**
 * JavaScript performance optimization utilities
 * Provides functions to optimize JavaScript execution and improve Core Web Vitals
 */

/**
 * Throttle a function to limit how often it can be called
 * Useful for optimizing scroll and resize event handlers
 * 
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number = 100): (...funcArgs: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number = 0;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Debounce a function to ensure it only executes after a specified delay
 * Useful for inputs and other rapid user interactions
 * 
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number = 300): (...funcArgs: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    clearTimeout(timer);
    
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * Memorize (cache) expensive function results
 * 
 * @param fn The function to memoize
 * @returns A memoized version of the function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  } as T;
}

/**
 * Split long-running tasks into smaller chunks to avoid blocking the main thread
 * This improves Interaction to Next Paint (INP) and Total Blocking Time (TBT)
 * 
 * @param items Array of items to process
 * @param processItem Function to process each item
 * @param chunkSize Number of items to process in each chunk
 * @param delayBetweenChunks Delay between chunks in milliseconds
 */
export function chunkedProcessing<T>(
  items: T[],
  processItem: (item: T) => void,
  chunkSize: number = 5,
  delayBetweenChunks: number = 16 // ~ 1 frame at 60fps
): Promise<void> {
  return new Promise((resolve) => {
    if (!items.length) {
      resolve();
      return;
    }
    
    let index = 0;
    
    function processChunk() {
      const limit = Math.min(index + chunkSize, items.length);
      
      for (let i = index; i < limit; i++) {
        processItem(items[i]);
      }
      
      index = limit;
      
      if (index < items.length) {
        setTimeout(processChunk, delayBetweenChunks);
      } else {
        resolve();
      }
    }
    
    processChunk();
  });
}

/**
 * Run a function when the browser is idle
 * This helps improve First Input Delay (FID) and Time to Interactive (TTI)
 * 
 * @param callback Function to run during idle time
 * @param timeout Fallback timeout in milliseconds
 */
export function runWhenIdle(callback: () => void, timeout: number = 1000): void {
  if (typeof window === 'undefined') return;
  
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}

/**
 * Log function execution time
 * 
 * @param fn Function to measure
 * @param fnName Optional name for the function in logs
 * @returns Wrapped function that logs execution time
 */
export function measurePerformance<T extends (...args: any[]) => any>(fn: T, fnName?: string): T {
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    
    console.log(`${fnName || fn.name || 'Anonymous function'} execution time: ${(end - start).toFixed(2)}ms`);
    
    return result;
  } as T;
}