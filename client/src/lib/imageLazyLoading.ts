/**
 * Image Lazy Loading Utilities
 * 
 * This file provides utility functions for optimizing image loading
 * through lazy loading, responsive sizes, and proper loading attributes.
 */

/**
 * Generate a responsive srcSet for different viewport sizes
 * @param baseUrl Base URL of the image
 * @param widths Array of widths to generate srcset for
 * @returns Formatted srcSet string
 */
export const generateSrcSet = (baseUrl: string, widths: number[] = [640, 768, 1024, 1280, 1536]): string => {
  if (!baseUrl) return '';
  
  // Handle Cloudinary URLs
  if (baseUrl.includes('cloudinary.com')) {
    return widths
      .map(width => {
        // Extract the upload path from the URL
        const uploadMatch = baseUrl.match(/\/upload\/(.+)$/);
        if (!uploadMatch) return '';
        
        const uploadPath = uploadMatch[1];
        const basePath = baseUrl.split('/upload/')[0];
        
        // Create transformation URL
        return `${basePath}/upload/w_${width},q_auto,f_auto/${uploadPath} ${width}w`;
      })
      .filter(Boolean)
      .join(', ');
  }
  
  // Handle random user API or other URLs
  if (baseUrl.includes('randomuser.me')) {
    return widths
      .map(width => `${baseUrl}?width=${width} ${width}w`)
      .join(', ');
  }
  
  // For other images, assume they might support width parameters
  try {
    const url = new URL(baseUrl);
    return widths
      .map(width => {
        url.searchParams.set('width', width.toString());
        return `${url.toString()} ${width}w`;
      })
      .join(', ');
  } catch (e) {
    // If URL parsing fails, return empty srcset
    return '';
  }
};

/**
 * Generate sizes attribute for responsive images
 * @returns Properly formatted sizes attribute string
 */
export const generateSizes = (): string => {
  return '(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw';
};

/**
 * Get optimized image loading attributes
 * @param priority Whether this is a high-priority image (above the fold)
 * @returns Object with loading, decoding, and fetchPriority attributes
 */
export const getImageLoadingAttrs = (priority: boolean = false) => {
  if (priority) {
    return {
      loading: "eager" as const,
      decoding: "sync" as const,
      fetchpriority: "high" as const,
    };
  }
  
  return {
    loading: "lazy" as const,
    decoding: "async" as const,
    fetchpriority: "auto" as const,
  };
};

/**
 * Optimized image component props
 */
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}