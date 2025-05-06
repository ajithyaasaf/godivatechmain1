import React, { useState, useEffect, useMemo } from "react";
import { getMobileImageSrcSet } from "@/lib/mobileOptimization";

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
  className = "",
  priority = false,
  lazyBoundary = "200px",
  sizes = "100vw",
  mobileSizes = "(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw",
  quality = 80,
  placeholder,
  format = 'auto',
  objectFit = 'cover',
  blur = false,
  preventLcp = false,
  seoCaption,
  shouldGenerateStructuredData = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Generate srcset for responsive images using the utility
  const { srcset, sizes: generatedSizes } = useMemo(() => {
    if (src.includes('cloudinary')) {
      const widths = isMobile ? [375, 640, 768] : [640, 768, 1024, 1280, 1536];
      return getMobileImageSrcSet(src, widths);
    }
    return { srcset: '', sizes: '' };
  }, [src, isMobile]);

  // Generate responsive src based on screen size
  const getResponsiveSrc = () => {
    // If it's already a Cloudinary URL, add transformations
    if (src.includes('cloudinary.com')) {
      const baseUrl = src.split('/upload/')[0] + '/upload/';
      const imagePath = src.split('/upload/')[1];
      
      // Determine optimal format based on props
      const formatStr = format === 'webp' ? 'f_webp' : 
                        format === 'auto' ? 'f_auto' : '';
      
      // Use blur effect if specified
      const blurStr = blur ? 'e_blur:300,' : '';
      
      // Quality settings based on device and priority
      const qualityStr = isMobile ? 
        (priority ? `q_${Math.min(quality, 80)},` : 'q_auto:low,') :
        (priority ? `q_${quality},` : 'q_auto:good,');
      
      // Width and DPR settings based on device
      const widthStr = width ? `w_${width},` : 'w_auto,';
      const dprStr = isMobile ? 'dpr_1.2,' : 'dpr_auto,';
      
      // Complete transformation string
      const transforms = `${qualityStr}${formatStr ? formatStr + ',' : ''}${blurStr}${widthStr}${dprStr}c_limit`;
      
      return `${baseUrl}${transforms}/${imagePath}`;
    }
    
    // For non-Cloudinary images, return as is
    return src;
  };

  // Determine if image should be loaded eagerly or lazily
  const loadingStrategy = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";
  
  // Aspect ratio container to prevent CLS
  const hasAspectRatio = width && height;
  const aspectRatio = hasAspectRatio ? width / height : undefined;
  
  // Mobile improvements for Core Web Vitals
  const mobileOptimizations = isMobile ? {
    // Use lower quality and smaller images for mobile
    sizes: mobileSizes,
    // Avoid layout shifts using fixed aspect ratio for mobile
    style: hasAspectRatio ? {
      aspectRatio: aspectRatio?.toString(),
      height: 'auto',
      maxHeight: `${height}px`,
      width: '100%'
    } : undefined
  } : {};
  
  // Object fit property based on preference
  const objectFitClass = hasAspectRatio ? `object-${objectFit}` : '';
  
  // Improve LCP by using the 'fetchpriority' HTML attribute
  const lcpAttributes = priority && !preventLcp ? {
    'fetchpriority': 'high' as const,
    'importance': 'high' as const
  } : {};
  
  // SEO markup for images (especially for Google Discover)
  const imageCaption = seoCaption || alt;
  
  return (
    <figure className={className}>
      <div 
        className={`overflow-hidden ${hasAspectRatio ? 'relative' : ''}`}
        style={hasAspectRatio ? { 
          aspectRatio: aspectRatio?.toString(),
          position: 'relative',
          backgroundColor: 'rgba(0,0,0,0.02)'
        } : undefined}
        aria-label={alt}
      >
        {placeholder && !loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-neutral-50 animate-pulse"
            style={{
              aspectRatio: aspectRatio?.toString()
            }}
          />
        )}
        
        <img
          src={getResponsiveSrc()}
          alt={alt}
          width={width}
          height={height}
          loading={loadingStrategy}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 max-w-full h-auto ${hasAspectRatio ? `absolute top-0 left-0 w-full h-full ${objectFitClass}` : ''}`}
          sizes={isMobile ? mobileSizes : sizes}
          srcSet={srcset ? srcset : undefined}
          {...lcpAttributes}
          {...mobileOptimizations}
        />
      </div>
      
      {/* Add caption for image SEO */}
      {(imageCaption && shouldGenerateStructuredData) && (
        <figcaption className="text-xs text-neutral-500 mt-1 text-center">
          {imageCaption}
        </figcaption>
      )}
      
      {/* Add structured data for images to improve SEO for Google Discover */}
      {shouldGenerateStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "contentUrl": getResponsiveSrc(),
            "description": alt,
            "width": width,
            "height": height,
            "caption": imageCaption
          }, null, 0)}
        </script>
      )}
    </figure>
  );
};

export default OptimizedImage;