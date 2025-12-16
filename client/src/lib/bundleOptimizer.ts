/**
 * JavaScript bundle performance tracking utilities
 * Provides functions to track bundle load and execution times
 */

interface BundleMetrics {
  loadTime: number;
  executionTime: number;
  size: number | null;
  timestamp: number;
}

const bundleMetrics: Record<string, BundleMetrics> = {};

/**
 * Track the performance of a JavaScript bundle
 * This helps monitor and optimize bundle sizes and load times
 * 
 * @param bundleName A unique identifier for the bundle
 * @param reportCallback Optional callback for metrics reporting
 */
export function trackBundlePerformance(
  bundleName: string,
  reportCallback?: (metrics: BundleMetrics) => void
) {
  if (typeof window === 'undefined' || typeof performance === 'undefined') return;
  
  const timestamp = Date.now();
  const startExecutionTime = performance.now();
  
  // Use requestAnimationFrame to ensure we capture full execution time
  requestAnimationFrame(() => {
    const executionTime = performance.now() - startExecutionTime;
    
    // Get load metrics if performance API is fully supported
    let loadTime = 0;
    let size = null;
    
    if (
      'getEntriesByType' in performance && 
      'getEntriesByName' in performance
    ) {
      // Try to find resources matching bundle name
      const resources = performance.getEntriesByType('resource')
        .filter(resource => {
          const name = resource.name.toLowerCase();
          const bundleSearch = bundleName.toLowerCase();
          return name.includes(bundleSearch) && 
                (name.includes('.js') || name.includes('bundle') || name.includes('chunk'));
        });
      
      if (resources.length > 0) {
        // Use the slowest load time as the bundle load time
        loadTime = Math.max(...resources.map(r => r.duration));
        
        // Estimate size if available
        if ('transferSize' in resources[0]) {
          size = (resources[0] as any).transferSize || null;
        }
      }
    }
    
    const metrics: BundleMetrics = {
      loadTime,
      executionTime,
      size,
      timestamp
    };
    
    // Store metrics
    bundleMetrics[bundleName] = metrics;
    
    // Report metrics if callback is provided
    if (reportCallback) {
      reportCallback(metrics);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`[Bundle Metrics] ${bundleName}:`, metrics);
    }
  });
}

/**
 * Get the performance metrics for all tracked bundles
 * @returns Record of bundle metrics by bundle name
 */
export function getBundleMetrics(): Record<string, BundleMetrics> {
  return { ...bundleMetrics };
}

/**
 * Clear all tracked bundle metrics
 */
export function clearBundleMetrics(): void {
  Object.keys(bundleMetrics).forEach(key => {
    delete bundleMetrics[key];
  });
}