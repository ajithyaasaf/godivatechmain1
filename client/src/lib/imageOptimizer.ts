/**
 * Image optimization utilities
 * Helps improve loading times for images by generating appropriate srcsets,
 * lazy loading, and optimizing images based on viewport size
 */

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

/**
 * Generates optimized image attributes for responsive images
 */
export function getOptimizedImageProps({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  loading = 'lazy',
  className = '',
  fetchPriority = 'auto'
}: OptimizedImageProps): React.ImgHTMLAttributes<HTMLImageElement> {
  // Create a result object with correct DOM attribute keys
  const result: any = {
    src: '',
    alt,
    width,
    height,
    loading,
    className,
    // Use lowercase DOM attribute name
    fetchpriority: fetchPriority
  };

  // Handle Cloudinary-specific optimizations
  if (src && src.includes('cloudinary.com') && src.includes('/upload/')) {
    // Create multiple sizes for responsive images
    const widths = [400, 600, 800, 1200, 1600, 2000];
    const srcset = widths
      .map((w) => {
        const optimizedUrl = src.replace(
          '/upload/',
          `/upload/c_scale,w_${w},q_auto,f_auto/`
        );
        return `${optimizedUrl} ${w}w`;
      })
      .join(', ');

    // Generate smaller preview image for faster initial loading
    const lowQualityPreview = src.replace(
      '/upload/',
      '/upload/c_scale,w_20,e_blur:500,q_30,f_auto/'
    );

    // Update result object with Cloudinary-specific values
    result.src = src.replace('/upload/', '/upload/q_auto,f_auto/');
    result.srcSet = srcset;
    result.sizes = sizes;
    result.style = {
      backgroundImage: `url(${lowQualityPreview})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
    result.onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      // Remove background image once the full image loads
      if (e.currentTarget) {
        e.currentTarget.style.backgroundImage = 'none';
      }
    };

    return result;
  }

  // For regular images (non-Cloudinary)
  result.src = src;
  return result;
}

/**
 * Preloads critical images to improve LCP times
 */
export function preloadCriticalImages(images: string[]): void {
  if (typeof document === 'undefined') return;

  images.forEach(imageSrc => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageSrc.includes('cloudinary.com') 
      ? imageSrc.replace('/upload/', '/upload/q_auto,f_auto/') 
      : imageSrc;
    document.head.appendChild(link);
  });
}

/**
 * Determines if an image should be lazy loaded based on importance
 */
export function shouldLazyLoad(importance: 'high' | 'medium' | 'low'): 'lazy' | 'eager' {
  return importance === 'high' ? 'eager' : 'lazy';
}

/**
 * Gets appropriate fetchPriority value based on importance
 */
export function getImageFetchPriority(importance: 'high' | 'medium' | 'low'): 'high' | 'low' | 'auto' {
  switch (importance) {
    case 'high': return 'high';
    case 'low': return 'low'; 
    default: return 'auto';
  }
}

/**
 * Sets up lazy loading for images across the site
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  // Use native lazy loading for browsers that support it
  if ('loading' in HTMLImageElement.prototype) {
    // Apply lazy loading to all images except those marked with data-priority="high"
    document.querySelectorAll('img:not([data-priority="high"])').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    // Load a lightweight lazy loading library if needed
    // This is a simple implementation using Intersection Observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      // Find all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  // Also optimize image loading for background images with data attributes
  document.querySelectorAll('[data-background-image]').forEach(el => {
    const bgImage = (el as HTMLElement).dataset.backgroundImage;
    if (bgImage) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.backgroundImage = `url(${bgImage})`;
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      observer.observe(el);
    }
  });
}