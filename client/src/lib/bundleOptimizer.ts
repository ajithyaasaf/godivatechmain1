/**
 * Bundle Optimization Utilities
 * 
 * This module provides tools to optimize JS/CSS bundle loading:
 * - Bundle splitting
 * - Tree-shaking helpers
 * - Dependency optimization
 */

/**
 * Dynamically load a component with code splitting
 * @param componentPath Path to component
 * @param options Loading options
 * @returns Promise resolving to component
 */
export async function loadComponent<T>(
  componentPath: string,
  options: {
    fallback?: React.ReactNode;
    preload?: boolean;
    errorBoundary?: boolean;
  } = {}
): Promise<T> {
  const { preload = false } = options;
  
  // Preload the component
  if (preload && typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = componentPath;
    document.head.appendChild(link);
  }
  
  // Dynamically import the component
  try {
    const module = await import(/* @vite-ignore */ componentPath);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load component: ${componentPath}`, error);
    throw error;
  }
}

/**
 * Register components that should be lazily loaded
 * @param components Map of component paths
 * @returns Object with lazy loaded components
 */
export function registerLazyComponents<T extends Record<string, string>>(
  components: T
): { [K in keyof T]: () => Promise<any> } {
  const lazyComponents: Record<string, () => Promise<any>> = {};
  
  // Create a lazy loader for each component
  Object.entries(components).forEach(([name, path]) => {
    lazyComponents[name] = () => loadComponent(path);
  });
  
  return lazyComponents as { [K in keyof T]: () => Promise<any> };
}

/**
 * Create a dynamic import boundary
 * @param modulePath Path to the module
 * @returns A module that can be imported dynamically
 */
export function createDynamicImport<T>(modulePath: string): () => Promise<T> {
  return () => import(/* @vite-ignore */ modulePath);
}

/**
 * Track bundle size and loading performance
 * @param bundleName Name of the bundle to track
 */
export function trackBundlePerformance(bundleName: string): void {
  if (typeof window === 'undefined' || typeof performance === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }
  
  try {
    // Record bundle load start time
    const startTime = performance.now();
    
    // Track when the bundle is loaded
    window.addEventListener('load', () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.log(`Bundle '${bundleName}' loaded in ${loadTime.toFixed(2)}ms`);
      
      // Analyze resources loaded
      if (performance.getEntriesByType) {
        const resources = performance.getEntriesByType('resource');
        let totalSize = 0;
        
        const jsResources = resources.filter(r => r.name.endsWith('.js'));
        const cssResources = resources.filter(r => r.name.endsWith('.css'));
        
        jsResources.forEach(r => {
          // Use transferSize if available, otherwise estimatedSize
          const size = (r as any).transferSize || ((r as any).decodedBodySize || 0);
          totalSize += size;
          
          if (size > 100 * 1024) { // Larger than 100KB
            console.warn(`Large JS resource: ${r.name} (${(size / 1024).toFixed(1)}KB)`);
          }
        });
        
        cssResources.forEach(r => {
          const size = (r as any).transferSize || ((r as any).decodedBodySize || 0);
          totalSize += size;
          
          if (size > 50 * 1024) { // Larger than 50KB
            console.warn(`Large CSS resource: ${r.name} (${(size / 1024).toFixed(1)}KB)`);
          }
        });
        
        console.log(`Total bundle size: ${(totalSize / 1024).toFixed(1)}KB`);
      }
    });
  } catch (error) {
    console.error('Error tracking bundle performance:', error);
  }
}

/**
 * Preload critical bundles to speed up loading
 * @param bundles List of bundle paths to preload
 */
export function preloadCriticalBundles(bundles: string[]): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  bundles.forEach(bundle => {
    const link = document.createElement('link');
    
    if (bundle.endsWith('.js')) {
      link.rel = 'modulepreload';
      link.href = bundle;
    } else if (bundle.endsWith('.css')) {
      link.rel = 'preload';
      link.href = bundle;
      link.as = 'style';
    } else {
      // Skip unknown file types
      return;
    }
    
    document.head.appendChild(link);
  });
}

/**
 * Initialize bundle loading for non-critical parts
 * This helps with performance by deferring loading of non-critical parts
 * @param bundles List of bundle paths to load
 * @param delay Delay before loading in ms
 */
export function loadNonCriticalBundles(bundles: string[], delay = 1000): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Wait for initial load
  window.addEventListener('load', () => {
    setTimeout(() => {
      bundles.forEach(bundle => {
        if (bundle.endsWith('.js')) {
          const script = document.createElement('script');
          script.src = bundle;
          script.async = true;
          script.type = 'module';
          document.body.appendChild(script);
        } else if (bundle.endsWith('.css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = bundle;
          document.head.appendChild(link);
        }
      });
    }, delay);
  });
}