import React from 'react';
import { getOptimizedImageProps } from '@/lib/imageOptimizer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  importance?: 'high' | 'medium' | 'low';
  className?: string;
}

/**
 * Optimized image component that automatically applies best practices
 * for performance, including responsive sizing, appropriate loading
 * strategies, and format optimization
 */
function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  importance = 'medium',
  className = '',
}: OptimizedImageProps) {
  const loading = importance === 'high' ? 'eager' : 'lazy';
  const fetchPriority = importance === 'high' ? 'high' : importance === 'low' ? 'low' : 'auto';

  const imageProps = getOptimizedImageProps({
    src,
    alt,
    width,
    height,
    sizes,
    loading,
    className,
    fetchPriority,
  });

  return <img {...imageProps} />;
}

/**
 * Optimized background image component that applies a div with 
 * background image and appropriate styles
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  children,
  className = '',
  style = {},
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  // Optimize the URL for Cloudinary if applicable
  const optimizedSrc = src.includes('cloudinary.com') && src.includes('/upload/')
    ? src.replace('/upload/', '/upload/q_auto,f_auto/')
    : src;

  const combinedStyle: React.CSSProperties = {
    backgroundImage: `url(${optimizedSrc})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    ...style,
  };

  return (
    <div className={className} style={combinedStyle} role="img" aria-label={alt}>
      {children}
    </div>
  );
}

export { OptimizedImage };
export default OptimizedImage;