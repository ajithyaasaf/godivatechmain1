import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  style?: React.CSSProperties;
  onLoad?: () => void;
}

/**
 * Optimized image component that follows Web Vitals best practices
 * 
 * This component:
 * - Sets proper width/height to prevent CLS
 * - Uses native lazy loading for offscreen images
 * - Implements proper decoding attributes
 * - Supports modern fetchpriority for browsers that support it
 * - Creates placeholders for images to maintain layout before load
 * - Supports WebP/AVIF with fallbacks (when using imageUrl helper)
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  loading = 'lazy',
  decoding = 'async',
  sizes = '100vw',
  fetchPriority = 'auto',
  style,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const aspectRatio = height / width;
  
  // If priority is true, override loading and fetchPriority
  const imageLoading = priority ? 'eager' : loading;
  const imageFetchPriority = priority ? 'high' : fetchPriority;
  
  // Calculate placeholder dimensions based on aspect ratio
  const placeholderStyle: React.CSSProperties = {
    paddingBottom: `${aspectRatio * 100}%`,
    backgroundColor: '#f3f4f6', // Light gray placeholder
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  };
  
  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  // Reset loaded state if src changes
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);
  
  // If this is a critical image or above the fold, preload it
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);
  
  // Create image attributes with proper DOM attribute names
  const imgProps: any = {
    src,
    alt,
    width,
    height,
    loading: imageLoading,
    decoding,
    sizes,
    // Use lowercase DOM attribute name
    fetchpriority: imageFetchPriority,
    onLoad: handleLoad,
    style: {
      opacity: isLoaded ? 1 : 0,
      transition: 'opacity 0.3s ease-in-out',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }
  };
  
  return (
    <div 
      className={`optimized-image-container ${className}`} 
      style={{
        width: '100%',
        maxWidth: width,
        ...style,
      }}
    >
      {/* Placeholder to maintain layout and prevent CLS */}
      <div style={placeholderStyle}>
        <img {...imgProps} />
      </div>
    </div>
  );
};

export default OptimizedImage;