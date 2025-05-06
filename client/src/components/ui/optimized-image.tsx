import React, { useState, useEffect } from 'react';
import { getMobileImageSrcSet, createMobileImageStructuredData } from '@/lib/mobileOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  lazyBoundary?: string;
  sizes?: string;
  quality?: number;
  placeholder?: string;
  mobileSizes?: string;
  format?: 'webp' | 'auto' | 'original';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  blur?: boolean;
  preventLcp?: boolean;
  seoCaption?: string;
  shouldGenerateStructuredData?: boolean;
}

/**
 * OptimizedImage component that handles responsive images with proper loading attributes
 * to improve Core Web Vitals (LCP, CLS) on mobile devices
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  lazyBoundary = '200px',
  sizes = '100vw',
  quality = 80,
  placeholder = 'empty',
  mobileSizes,
  format = 'auto',
  objectFit = 'cover',
  blur = false,
  preventLcp = false,
  seoCaption,
  shouldGenerateStructuredData = false
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices for serving optimized content
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.indexOf(keyword) !== -1) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Transform image URL based on format preference
  const getOptimizedSrc = () => {
    // Handle Cloudinary transformations
    if (src.includes('cloudinary.com') && format !== 'original') {
      if (format === 'webp') {
        return src.replace('/upload/', `/upload/f_webp,q_${quality}/`);
      } else {
        return src.replace('/upload/', `/upload/q_${quality},f_auto/`);
      }
    }
    return src;
  };
  
  // Get srcset for responsive images
  const getSrcSet = () => {
    // For cloudinary images
    if (src.includes('cloudinary.com') && src.includes('upload')) {
      const widths = [320, 480, 640, 768, 1024, 1280];
      const cloudinarySrcSet = widths.map(w => {
        const transformedUrl = src.replace('/upload/', `/upload/w_${w},q_${quality},f_auto/`);
        return `${transformedUrl} ${w}w`;
      }).join(', ');
      
      return cloudinarySrcSet;
    }
    
    // For other images
    return '';
  };
  
  // Loading strategy based on priority and position
  const loading = priority ? 'eager' : 'lazy';
  
  // Additional CSS classes for blur effect
  const blurClass = blur ? 'transition-opacity duration-500 blur-sm hover:blur-none' : '';
  
  // Apply sizes based on device
  const responsiveSizes = isMobile && mobileSizes ? mobileSizes : sizes;

  // Set appropriate CSS class for object-fit
  const objectFitClass = 
    objectFit === 'cover' ? 'object-cover' :
    objectFit === 'contain' ? 'object-contain' :
    objectFit === 'fill' ? 'object-fill' : '';
  
  // Add special treatment for LCP (Largest Contentful Paint) images
  const lcpAttributes: Record<string, string> = !preventLcp && priority ? {
    'fetchpriority': 'high',
    'importance': 'high'
  } : {};
  
  const optimizedSrc = getOptimizedSrc();
  const srcSet = getSrcSet();

  return (
    <figure className={`relative ${className}`}>
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        sizes={responsiveSizes}
        srcSet={srcSet || undefined}
        className={`${objectFitClass} ${blurClass} w-full h-full`}
        {...lcpAttributes}
      />
      
      {seoCaption && (
        <figcaption className="text-sm text-gray-600 mt-2 italic">
          {seoCaption}
        </figcaption>
      )}
      
      {shouldGenerateStructuredData && (
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(
              createMobileImageStructuredData(
                optimizedSrc, 
                alt, 
                width || 1200, 
                height || 630
              )
            )
          }}
        />
      )}
    </figure>
  );
};

export default OptimizedImage;