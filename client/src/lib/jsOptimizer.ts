/**
 * JavaScript Optimization Utilities
 * 
 * This module provides tools to optimize JavaScript loading and execution:
 * - Code splitting strategies
 * - Lazy initialization
 * - Runtime performance improvements
 */

/**
 * Function to dynamically import JavaScript modules only when needed
 * @param module The module path to import
 * @returns Promise resolving to the imported module
 */
export function dynamicImport<T>(module: string): Promise<T> {
  return import(/* @vite-ignore */ module);
}

/**
 * Throttle a function to limit its execution frequency
 * Useful for optimizing high-frequency events like scroll, resize
 * @param fn Function to throttle
 * @param delay Minimum time between executions (ms)
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T, 
  delay = 100
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    
    if (timeSinceLastCall >= delay) {
      lastCallTime = now;
      fn(...args);
    } else {
      // Clear any pending execution
      if (timeout) {
        clearTimeout(timeout);
      }
      
      // Schedule execution at the end of the delay period
      timeout = setTimeout(() => {
        lastCallTime = Date.now();
        fn(...args);
        timeout = null;
      }, delay - timeSinceLastCall);
    }
  };
}

/**
 * Run a task asynchronously during browser idle time
 * @param task Function to run
 * @param timeout Timeout in ms if requestIdleCallback isn't available
 */
export function runWhenIdle(task: () => void, timeout = 1000): void {
  if (typeof window === 'undefined') return;
  
  // Use requestIdleCallback if available, otherwise use setTimeout
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => task(), { timeout });
  } else {
    setTimeout(task, 50); // Smaller timeout as fallback
  }
}

/**
 * Break a heavy computation into chunks to avoid blocking the main thread
 * @param items Items to process
 * @param processFn Function to process a single item
 * @param options Configuration options
 */
export function chunkProcess<T>(
  items: T[],
  processFn: (item: T) => void,
  options: { chunkSize?: number; delay?: number } = {}
): Promise<void> {
  const { chunkSize = 10, delay = 1 } = options;
  let index = 0;
  
  return new Promise((resolve) => {
    function processChunk() {
      const chunk = items.slice(index, index + chunkSize);
      if (chunk.length === 0) {
        resolve();
        return;
      }
      
      // Process current chunk
      chunk.forEach(processFn);
      
      // Move to next chunk
      index += chunkSize;
      
      // Schedule next chunk
      setTimeout(processChunk, delay);
    }
    
    processChunk();
  });
}

/**
 * Optimize event listeners by using passive mode where appropriate
 * @param element Target DOM element
 * @param eventType Event type
 * @param handler Event handler
 * @param options Event listener options
 */
export function addOptimizedEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  eventType: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): void {
  // Auto-detect events that should use passive mode for better performance
  const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  const wheelEvents = ['wheel', 'mousewheel'];
  
  const shouldBePassive = [...touchEvents, ...wheelEvents].includes(eventType as string);
  
  if (shouldBePassive && typeof options === 'object') {
    // Use passive listeners for these events to prevent blocking the main thread
    element.addEventListener(eventType, handler as EventListener, {
      ...options,
      passive: options.passive !== false // Default to true unless explicitly set to false
    });
  } else if (shouldBePassive && (options === undefined || typeof options === 'boolean')) {
    // No options provided or boolean passive option
    element.addEventListener(eventType, handler as EventListener, {
      passive: true,
      capture: typeof options === 'boolean' ? options : false
    });
  } else {
    // Use normal event listener for other events
    element.addEventListener(eventType, handler as EventListener, options);
  }
}

/**
 * Monitor JS execution performance
 * @param name Identifier for the code being monitored
 * @param thresholdMs Warning threshold in milliseconds
 * @returns Function to call when finished to measure duration
 */
export function monitorPerformance(name: string, thresholdMs = 100): () => void {
  if (typeof performance === 'undefined' || process.env.NODE_ENV !== 'development') {
    // Return a no-op function if performance API is not available
    return () => {};
  }
  
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    if (duration > thresholdMs) {
      console.warn(`Performance warning: "${name}" took ${duration.toFixed(2)}ms, which exceeds the ${thresholdMs}ms threshold.`);
    }
  };
}

/**
 * Initialize deferred JavaScript that isn't needed immediately
 * @param initFunctions Map of functions to initialize
 * @param delay Delay before initialization in ms
 */
export function initDeferred(
  initFunctions: Record<string, () => void>,
  delay = 2000
): void {
  if (typeof window === 'undefined') return;
  
  // Wait until page is fully loaded and initial animations complete
  window.addEventListener('load', () => {
    setTimeout(() => {
      // Initialize each function one by one with small delays
      Object.entries(initFunctions).forEach(([name, fn], index) => {
        setTimeout(() => {
          try {
            fn();
          } catch (error) {
            console.error(`Error initializing deferred module "${name}":`, error);
          }
        }, index * 100);
      });
    }, delay);
  });
}