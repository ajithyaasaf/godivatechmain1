/**
 * LCP (Largest Contentful Paint) Optimization Utilities
 * 
 * This module provides tools to optimize LCP:
 * - Preload critical hero images
 * - Font optimization
 * - Prioritize rendering of above-the-fold content
 */

/**
 * Track and report LCP performance
 */
export function trackLCP(): void {
  if (typeof PerformanceObserver === 'undefined') return;
  
  try {
    // Create observer for LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Log LCP value
      const lcpTime = lastEntry.startTime;
      console.log(`LCP: ${Math.round(lcpTime)}ms`);
      
      // Store for potential reporting to analytics
      window.__LCP_VALUE__ = lcpTime;
    });
    
    // Start observing LCP
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.error('Error tracking LCP:', e);
  }
}

/**
 * Get the current LCP element
 * @returns The current LCP element or null if not found
 */
export function getLCPElement(): Element | null {
  // This is a simplified version for demo purposes
  // In a real app, you would use PerformanceObserver
  
  const possibleLCPSelectors = [
    '.hero-section img', // Hero image
    'h1', // Main heading
    '.hero-content', // Hero content container
    'main > section:first-child', // First section
  ];
  
  for (const selector of possibleLCPSelectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  
  return null;
}

/**
 * Preload critical hero images to improve LCP
 * @param imageSources Array of critical image URLs to preload
 */
export function preloadHeroImages(imageSources: string[]): void {
  if (typeof document === 'undefined') return;
  
  imageSources.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    // For key hero images, use high fetch priority
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);
  });
}

/**
 * Optimize webfonts loading to reduce layout shifts
 */
export function optimizeFonts(): void {
  if (typeof document === 'undefined') return;
  
  // Add font-display: swap to font declarations
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-display: swap !important;
    }
  `;
  document.head.appendChild(style);
  
  // Preload critical fonts
  const fontUrls = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  ];
  
  fontUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Optimize initial render to prioritize above-the-fold content
 */
export function optimizeInitialRender(): void {
  if (typeof document === 'undefined') return;
  
  // Delay loading of below-the-fold content
  const belowFoldElements = document.querySelectorAll('[data-below-fold="true"]');
  belowFoldElements.forEach((element) => {
    // Hide element initially
    (element as HTMLElement).style.visibility = 'hidden';
    
    // Show element once above-the-fold content is rendered
    setTimeout(() => {
      (element as HTMLElement).style.visibility = 'visible';
    }, 100);
  });
  
  // Priority load critical content
  const aboveFoldElements = document.querySelectorAll('[data-above-fold="true"]');
  aboveFoldElements.forEach((element) => {
    // Use high priority for important elements
    element.setAttribute('loading', 'eager');
    
    // If it's an image, also set fetch priority
    if (element instanceof HTMLImageElement) {
      element.setAttribute('fetchpriority', 'high');
    }
  });
}

/**
 * Decode images asynchronously to improve rendering performance
 * @param selector CSS selector for images to optimize
 */
export function decodeImagesAsync(selector = 'img[loading="eager"]'): void {
  if (typeof document === 'undefined') return;
  
  const images = document.querySelectorAll<HTMLImageElement>(selector);
  
  images.forEach((img) => {
    if (img.decode) {
      // Use image.decode() API for non-blocking image decoding
      img.decoding = 'async';
      
      // Decode image in background
      img.decode().catch(() => {
        // Silently fail on decode errors
      });
    }
  });
}

// Define window augmentation for LCP tracking
declare global {
  interface Window {
    __LCP_VALUE__?: number;
  }
}