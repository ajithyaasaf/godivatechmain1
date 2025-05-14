/**
 * Image Optimization Utilities
 * 
 * This module provides tools to optimize image loading and rendering:
 * - Responsive image delivery
 * - Quality/format optimization
 * - Progressive loading techniques
 * - Lazy loading
 */

import { createLazyLoadObserver } from './performance';

/**
 * Generate Cloudinary transformation URL for optimal image delivery
 * @param url Original Cloudinary URL
 * @param options Transformation options
 * @returns Optimized Cloudinary URL
 */
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
    blur?: number;
    crop?: 'fill' | 'crop' | 'scale';
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    blur,
    crop = 'fill'
  } = options;
  
  // Parse the Cloudinary URL to extract base and path
  const [baseUrl, imagePath] = url.split('/upload/');
  if (!baseUrl || !imagePath) return url;
  
  // Build transformation string
  const transformations = [];
  
  // Add dimension transformations
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);
  
  // Add quality and format
  if (quality) {
    transformations.push(quality === 'auto' ? 'q_auto' : `q_${quality}`);
  }
  if (format) {
    transformations.push(format === 'auto' ? 'f_auto' : `f_${format}`);
  }
  
  // Add blur if specified
  if (blur && blur > 0) {
    transformations.push(`e_blur:${blur}`);
  }
  
  // Assemble the new URL
  return `${baseUrl}/upload/${transformations.join(',')}/` + 
    (imagePath.includes('/') ? imagePath.split('/').slice(1).join('/') : imagePath);
}

/**
 * Get optimal image format based on browser support
 * @returns Best supported image format
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpg' {
  // Check if browser supports test in a very performant way
  const hasAvif = false; // We'll determine this at runtime
  const hasWebp = false; // We'll determine this at runtime
  
  if (typeof document !== 'undefined') {
    // Initialize checks only once
    if (!('_formatChecked' in window)) {
      // @ts-ignore - Custom property
      window._formatChecked = true;
      
      // Check for WebP support
      const webpImage = new Image();
      webpImage.onload = function() {
        // @ts-ignore - Custom property
        window._supportsWebp = true;
      };
      webpImage.onerror = function() {
        // @ts-ignore - Custom property
        window._supportsWebp = false;
      };
      webpImage.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
      
      // Check for AVIF support
      const avifImage = new Image();
      avifImage.onload = function() {
        // @ts-ignore - Custom property
        window._supportsAvif = true;
      };
      avifImage.onerror = function() {
        // @ts-ignore - Custom property
        window._supportsAvif = false;
      };
      avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    }
    
    // Return the best format based on browser support
    if ((window as any)._supportsAvif) {
      return 'avif';
    } else if ((window as any)._supportsWebp) {
      return 'webp';
    }
  }
  
  return 'jpg'; // Fallback to JPG
}

/**
 * Setup lazy loading for all images with data-src attribute
 */
export function setupLazyLoading(): void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return;
  }
  
  const observer = createLazyLoadObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.getAttribute('data-src');
        
        if (src) {
          // Start loading the image
          img.src = src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
          
          // Add animation class if specified
          const animation = img.getAttribute('data-lazy-animation');
          if (animation) {
            img.classList.add(animation);
          }
        }
      }
    });
  });
  
  // Find all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
}

/**
 * Creates a progressive/blur-up loading effect for an image
 * @param imgElement Target image element
 * @param lowQualityUrl URL to a very small/blurry version of the image
 * @param highQualityUrl URL to the full quality image
 */
export function progressiveImageLoad(
  imgElement: HTMLImageElement,
  lowQualityUrl: string,
  highQualityUrl: string
): void {
  // First load the low quality placeholder
  imgElement.src = lowQualityUrl;
  
  // Apply placeholder style
  imgElement.style.filter = 'blur(20px)';
  imgElement.style.transition = 'filter 0.5s ease';
  
  // Create a new image to load the high quality version in the background
  const highQualityImg = new Image();
  highQualityImg.onload = () => {
    // Once loaded, switch to high quality
    imgElement.src = highQualityUrl;
    imgElement.style.filter = 'blur(0)';
  };
  highQualityImg.src = highQualityUrl;
}

/**
 * Get appropriate srcset values for responsive images
 * @param baseUrl Base image URL
 * @param widths Array of widths to generate
 * @param transformFn Function to transform URL for each width
 * @returns srcset attribute string
 */
export function generateResponsiveSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536],
  transformFn: (url: string, width: number) => string = (url, width) => url
): string {
  return widths
    .map(width => `${transformFn(baseUrl, width)} ${width}w`)
    .join(', ');
}

/**
 * Generate picture element with multiple formats for optimal loading
 * @param props Configuration options
 * @returns HTML string for picture element
 */
export function generatePictureHTML(props: {
  src: string;
  alt: string;
  className?: string;
  widths?: number[];
  sizes?: string;
}): string {
  const { 
    src, 
    alt, 
    className = '', 
    widths = [320, 640, 960, 1280],
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  } = props;
  
  // Generate URLs for different formats
  const avifSrcset = generateResponsiveSrcSet(
    src,
    widths,
    (url, width) => optimizeCloudinaryUrl(url, { width, format: 'avif' })
  );
  
  const webpSrcset = generateResponsiveSrcSet(
    src,
    widths,
    (url, width) => optimizeCloudinaryUrl(url, { width, format: 'webp' })
  );
  
  const jpgSrcset = generateResponsiveSrcSet(
    src,
    widths,
    (url, width) => optimizeCloudinaryUrl(url, { width, format: 'auto' })
  );
  
  return `
    <picture>
      <source type="image/avif" srcset="${avifSrcset}" sizes="${sizes}">
      <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
      <img 
        src="${optimizeCloudinaryUrl(src, { width: 640 })}" 
        srcset="${jpgSrcset}"
        sizes="${sizes}"
        alt="${alt}"
        class="${className}"
        loading="lazy"
        decoding="async"
      />
    </picture>
  `;
}