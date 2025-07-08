/**
 * Progressive Loading Strategy for Performance Optimization
 * Implements intelligent loading patterns to improve Core Web Vitals
 */

import { lazy } from 'react';

// Critical loading thresholds for different device types
const LOADING_THRESHOLDS = {
  // Based on device performance indicators
  FAST_DEVICE: 2000, // Load additional features after 2s on fast devices
  SLOW_DEVICE: 4000, // Load additional features after 4s on slow devices
  IDLE_TIMEOUT: 1000, // Wait for browser idle before loading non-critical features
};

/**
 * Detect device performance characteristics
 */
export function getDevicePerformanceLevel(): 'fast' | 'medium' | 'slow' {
  if (typeof window === 'undefined') return 'medium';
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check memory (if available)
  const memory = (navigator as any).deviceMemory;
  
  // Check connection (if available)
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType;
  
  // Fast device indicators
  if (cores >= 8 && (!memory || memory >= 8) && effectiveType !== 'slow-2g' && effectiveType !== '2g') {
    return 'fast';
  }
  
  // Slow device indicators
  if (cores <= 2 || (memory && memory < 4) || effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow';
  }
  
  return 'medium';
}

/**
 * Progressive component loader that prioritizes critical components
 */
export class ProgressiveLoader {
  private static loadedComponents = new Set<string>();
  private static devicePerformance = getDevicePerformanceLevel();
  
  /**
   * Load component with priority-based timing
   */
  static loadComponent<T>(
    componentName: string,
    importFn: () => Promise<T>,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    // Already loaded - return immediately
    if (this.loadedComponents.has(componentName)) {
      return importFn();
    }
    
    const delay = this.getLoadDelay(priority);
    
    return new Promise((resolve) => {
      // For critical components, load immediately
      if (priority === 'critical') {
        importFn().then(resolve);
        return;
      }
      
      // For other components, use requestIdleCallback when possible
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          setTimeout(() => {
            this.loadedComponents.add(componentName);
            importFn().then(resolve);
          }, delay);
        }, { timeout: delay + 1000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          this.loadedComponents.add(componentName);
          importFn().then(resolve);
        }, delay);
      }
    });
  }
  
  /**
   * Get loading delay based on priority and device performance
   */
  private static getLoadDelay(priority: 'critical' | 'high' | 'medium' | 'low'): number {
    const baseDelay = this.devicePerformance === 'slow' ? 
      LOADING_THRESHOLDS.SLOW_DEVICE : 
      LOADING_THRESHOLDS.FAST_DEVICE;
    
    switch (priority) {
      case 'critical': return 0;
      case 'high': return Math.floor(baseDelay * 0.3);
      case 'medium': return Math.floor(baseDelay * 0.6);
      case 'low': return baseDelay;
      default: return baseDelay;
    }
  }
  
  /**
   * Preload critical resources when browser is idle
   */
  static preloadCriticalResources() {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => {
        // Preload critical images
        const criticalImages = [
          '/home-hero.jpg',
          '/og-image.jpg'
        ];
        
        criticalImages.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          document.head.appendChild(link);
        });
        
        // Preload critical API endpoints
        if ('serviceWorker' in navigator) {
          // Cache critical API responses
          fetch('/api/services').catch(() => {});
          fetch('/api/projects').catch(() => {});
        }
      });
    }
  }
}

/**
 * Create lazily loaded component with progressive loading
 */
export function createLazyComponent(
  componentName: string,
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
) {
  return lazy(() => 
    ProgressiveLoader.loadComponent(componentName, importFn, priority)
  );
}

/**
 * Optimize API requests with progressive loading
 */
export class APIProgressiveLoader {
  private static cache = new Map<string, any>();
  private static loadingQueue: string[] = [];
  
  /**
   * Load API data with priority-based queuing
   */
  static async loadAPIData(
    endpoint: string,
    priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
  ): Promise<any> {
    // Return cached data immediately if available
    if (this.cache.has(endpoint)) {
      return this.cache.get(endpoint);
    }
    
    // For critical data, load immediately
    if (priority === 'critical') {
      return this.fetchAndCache(endpoint);
    }
    
    // For non-critical data, queue and load progressively
    this.loadingQueue.push(endpoint);
    this.processQueue();
    
    // Return promise that resolves when data is loaded
    return new Promise((resolve) => {
      const checkCache = () => {
        if (this.cache.has(endpoint)) {
          resolve(this.cache.get(endpoint));
        } else {
          setTimeout(checkCache, 100);
        }
      };
      checkCache();
    });
  }
  
  /**
   * Process the loading queue progressively
   */
  private static processQueue() {
    if (this.loadingQueue.length === 0) return;
    
    const deviceLevel = getDevicePerformanceLevel();
    const concurrency = deviceLevel === 'fast' ? 3 : deviceLevel === 'medium' ? 2 : 1;
    
    // Process multiple requests concurrently based on device performance
    for (let i = 0; i < Math.min(concurrency, this.loadingQueue.length); i++) {
      const endpoint = this.loadingQueue.shift();
      if (endpoint) {
        this.fetchAndCache(endpoint);
      }
    }
    
    // Schedule next batch if queue is not empty
    if (this.loadingQueue.length > 0) {
      const delay = deviceLevel === 'slow' ? 1000 : 500;
      setTimeout(() => this.processQueue(), delay);
    }
  }
  
  /**
   * Fetch and cache API data
   */
  private static async fetchAndCache(endpoint: string): Promise<any> {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        this.cache.set(endpoint, data);
        return data;
      }
    } catch (error) {
      console.error(`Failed to load ${endpoint}:`, error);
    }
    return null;
  }
}

// Initialize progressive loading on import
if (typeof window !== 'undefined') {
  // Start preloading critical resources when the page is loaded
  window.addEventListener('load', () => {
    ProgressiveLoader.preloadCriticalResources();
  });
}