import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  generateSrcSet, 
  generateSizes, 
  getImageLoadingAttrs, 
  OptimizedImageProps 
} from "@/lib/imageLazyLoading";

/**
 * Optimized Image Component
 * 
 * Features:
 * - Lazy loading for images below the fold
 * - Responsive images with srcSet and sizes
 * - Blur-up loading effect
 * - Proper loading attributes
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Generate responsive image attributes
  const srcSet = generateSrcSet(src);
  const sizeAttr = sizes || generateSizes();
  const loadingAttrs = getImageLoadingAttrs(priority);
  
  return (
    <div 
      className={cn(
        "overflow-hidden relative",
        className
      )}
      style={{ 
        backgroundColor: '#f9fafb',
        // Do not enforce specific dimensions, let the parent container and className control that
        aspectRatio: width && height ? `${width} / ${height}` : 'auto'
      }}
    >
      <img
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizeAttr}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        {...loadingAttrs}
      />
      
      {/* Super lightweight blur placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default OptimizedImage;