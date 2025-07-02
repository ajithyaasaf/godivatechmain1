/**
 * Animation Optimization Utilities
 * 
 * This module provides optimizations for animations to minimize their
 * impact on performance and LCP times
 */

/**
 * Delays heavy animations until after LCP (Largest Contentful Paint)
 * to prevent them from affecting the main content loading
 * 
 * @param lcpTimeoutMs Time to wait before starting animations (ms)
 * @returns Promise that resolves when it's safe to start animations
 */
export function delayAnimationsUntilAfterLCP(lcpTimeoutMs = 2000): Promise<void> {
  return new Promise(resolve => {
    // Check if LCP has already been recorded
    if (window.__LCP_VALUE__) {
      // If LCP is already recorded, wait a short time and then start animations
      setTimeout(resolve, 100);
      return;
    }
    
    // Listen for LCP event
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver(entryList => {
          const entries = entryList.getEntries();
          if (entries.length > 0) {
            // LCP has occurred, wait a short time and then start animations
            setTimeout(resolve, 100);
            lcpObserver.disconnect();
          }
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Fallback in case LCP event doesn't fire
        setTimeout(resolve, lcpTimeoutMs);
      } catch (e) {
        // Browser doesn't support this API, fallback to timeout
        setTimeout(resolve, lcpTimeoutMs);
      }
    } else {
      // Fallback for browsers without PerformanceObserver
      setTimeout(resolve, lcpTimeoutMs);
    }
  });
}

/**
 * Gets optimized animation settings for different device types
 * to reduce animation work on low-end devices
 * 
 * @returns Animation settings optimized for the current device
 */
export function getOptimizedAnimationSettings(): {
  duration: number;
  delayPerItem: number;
  cpuOptimizedValues: boolean;
  reduceMotion: boolean;
} {
  // Check for reduced motion preference
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  // Detect mobile devices - simplified check
  const isMobile = 
    typeof window !== 'undefined'
    ? window.innerWidth < 768 
    : false;
  
  // Get RAM if available through navigator
  const deviceMemory = 
    navigator.deviceMemory !== undefined 
    ? navigator.deviceMemory 
    : 8; // Default to 8GB if not available
  
  // Check for low-end device
  const isLowEndDevice = deviceMemory < 4 || isMobile;
  
  // Return optimized settings
  return {
    // Reduce animation duration on mobile and low-end devices
    duration: isLowEndDevice ? 0.3 : (prefersReducedMotion ? 0.1 : 0.5),
    
    // Reduce stagger delay between items on low-end devices
    delayPerItem: isLowEndDevice ? 0.05 : (prefersReducedMotion ? 0 : 0.1),
    
    // Enable CPU optimized values on low-end devices
    cpuOptimizedValues: isLowEndDevice,
    
    // Honor user preference for reduced motion
    reduceMotion: prefersReducedMotion
  };
}

/**
 * Get variants for framer-motion with optimization based on device capabilities
 * 
 * @param baseVariants Base animation variants
 * @returns Optimized animation variants
 */
export function getOptimizedAnimationVariants(baseVariants: any): any {
  const settings = getOptimizedAnimationSettings();
  
  // Create new variants with optimized values
  const optimizedVariants = { ...baseVariants };
  
  // Modify animation properties for better performance if needed
  if (settings.reduceMotion) {
    // Simplified animations for reduced motion preference
    Object.keys(optimizedVariants).forEach(key => {
      if (optimizedVariants[key].transition) {
        optimizedVariants[key].transition.duration = settings.duration;
      }
      
      // Remove scale and rotate transforms which can be most disorienting
      if (optimizedVariants[key].scale) {
        optimizedVariants[key].scale = 1;
      }
      if (optimizedVariants[key].rotate) {
        optimizedVariants[key].rotate = 0;
      }
    });
  } else if (settings.cpuOptimizedValues) {
    // Use CPU-optimized transforms for low-end devices
    Object.keys(optimizedVariants).forEach(key => {
      if (optimizedVariants[key].transition) {
        // Shorten duration and reduce spring stiffness
        optimizedVariants[key].transition.duration = settings.duration;
        
        // Remove spring physics in favor of simple tween
        if (optimizedVariants[key].transition.type === 'spring') {
          optimizedVariants[key].transition.type = 'tween';
        }
      }
    });
  }
  
  return optimizedVariants;
}

/**
 * Register event listeners to pause animations when tab is inactive
 */
export function setupAnimationPauseOnTabHidden(): void {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('visibilitychange', () => {
    const isHidden = document.hidden;
    
    // Find all animating elements and manage them
    document.querySelectorAll('.animate-running, [data-framer-animation]').forEach(el => {
      if (isHidden) {
        // Pause animations when tab is inactive
        el.classList.add('animation-paused');
      } else {
        // Resume animations when tab becomes active again
        el.classList.remove('animation-paused');
      }
    });
  });
}

// Define window augmentation for LCP tracking
declare global {
  interface Navigator {
    deviceMemory?: number;
  }
  
  interface Window {
    __LCP_VALUE__?: number;
  }
}