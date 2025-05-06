import React, { useState, useEffect } from "react";

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

  // Generate responsive src based on screen size
  const getResponsiveSrc = () => {
    // If it's already a Cloudinary URL, add transformations
    if (src.includes('cloudinary.com')) {
      const baseUrl = src.split('/upload/')[0] + '/upload/';
      const imagePath = src.split('/upload/')[1];
      
      // On mobile, use more aggressive optimization
      if (isMobile) {
        return `${baseUrl}q_auto:low,f_auto,w_auto,dpr_auto,c_limit/${imagePath}`;
      }
      
      // For desktop, use higher quality
      return `${baseUrl}q_auto:good,f_auto,w_auto,dpr_auto,c_limit/${imagePath}`;
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
  
  return (
    <div 
      className={`overflow-hidden ${hasAspectRatio ? 'relative' : ''} ${className}`}
      style={hasAspectRatio ? { 
        aspectRatio: aspectRatio?.toString(),
        position: 'relative',
        backgroundColor: 'rgba(0,0,0,0.05)'
      } : undefined}
      aria-label={alt}
    >
      {placeholder && !loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-neutral-100 animate-pulse"
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
        fetchPriority={fetchPriority as any}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 max-w-full h-auto ${hasAspectRatio ? 'absolute top-0 left-0 w-full h-full object-cover' : ''}`}
        sizes={isMobile ? mobileSizes : sizes}
      />
    </div>
  );
};

export default OptimizedImage;