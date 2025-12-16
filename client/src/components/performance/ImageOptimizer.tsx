import React, { useEffect, useState } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
}

/**
 * ImageOptimizer Component
 * 
 * Enhanced image component that implements best practices for performance:
 * - Proper width/height to prevent layout shifts
 * - Optional priority loading for above-the-fold images
 * - Blur-up loading effect
 * - Lazy loading for off-screen images
 * - Responsive image sizes
 */
const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If this is a priority image, preload it
    if (priority && typeof window !== 'undefined') {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'image';
      preloadLink.href = src;
      preloadLink.setAttribute('fetchpriority', 'high');
      document.head.appendChild(preloadLink);

      return () => {
        document.head.removeChild(preloadLink);
      };
    }
  }, [src, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : 'auto',
      }}
    >
      {/* Blur placeholder */}
      {!isLoaded && !priority && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ backdropFilter: 'blur(8px)' }}
        />
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleImageLoad}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        // Modern browsers attribute for image priority (lowercase for React DOM compatibility)
        {...(priority ? { fetchpriority: 'high' } : {})}
        data-above-fold={priority ? 'true' : 'false'}
      />
    </div>
  );
};

export default React.memo(ImageOptimizer);