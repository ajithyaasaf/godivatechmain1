/**
 * Image Lazy Loading Utilities
 * 
 * Provides utilities for optimized image loading to improve Core Web Vitals
 * metrics like Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).
 */

import { optimizeCloudinaryUrl } from "./imageOptimizer";

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Generate a responsive srcSet attribute for images
 * @param src Base image URL
 * @returns srcSet attribute string
 */
export function generateSrcSet(src: string): string {
  // Default widths for responsive images
  const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
  
  // For Cloudinary images, use their transformation API
  if (src.includes('cloudinary.com')) {
    return widths
      .map(w => `${optimizeCloudinaryUrl(src, { width: w })} ${w}w`)
      .join(', ');
  }
  
  // For regular images, return the original
  return src;
}

/**
 * Generate responsive sizes attribute for images
 * @param customSizes Optional custom sizes string
 * @returns Sizes attribute string
 */
export function generateSizes(customSizes?: string): string {
  if (customSizes) return customSizes;
  
  // Default sizes for responsive layout
  return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
}

/**
 * Get appropriate loading and decoding attributes for images
 * @param isPriority Whether this is a priority image (above the fold)
 * @returns Object with loading and decoding attributes
 */
export function getImageLoadingAttrs(isPriority: boolean = false): {
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync';
  fetchpriority?: 'high' | 'low' | 'auto'; // Changed to lowercase for DOM attribute
} {
  if (isPriority) {
    // For above-the-fold images, prioritize loading
    return {
      loading: 'eager',
      decoding: 'sync',
      fetchpriority: 'high', // Changed to lowercase for DOM attribute
    };
  }
  
  // For below-the-fold images, use lazy loading
  return {
    loading: 'lazy',
    decoding: 'async',
    fetchpriority: 'low', // Changed to lowercase for DOM attribute
  };
}

/**
 * Create a blur hash placeholder for an image
 * Simplified version that creates a color-based placeholder
 * @param imageUrl Image URL to analyze
 * @returns CSS gradient string for placeholder
 */
export function generatePlaceholder(imageUrl: string): string {
  // In a real implementation, we would analyze the image and generate a blur hash
  // For simplicity, we'll return a standard placeholder
  return "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)";
}

/**
 * Track image load performance
 * @param imageUrl URL of the image being tracked
 * @param loadTime Time taken to load in milliseconds
 */
export function trackImagePerformance(imageUrl: string, loadTime: number): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Image loaded: ${imageUrl} in ${loadTime}ms`);
  }
  
  // In production, we could send this to an analytics service
}