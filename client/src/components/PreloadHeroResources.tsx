import React, { useEffect } from 'react';
import { preloadImage, preconnect } from '@/lib/resourcePreloader';

/**
 * Component that preloads critical resources for the hero section
 * This improves Largest Contentful Paint (LCP) metrics
 */
const PreloadHeroResources: React.FC = () => {
  useEffect(() => {
    // Preload critical hero section images
    const criticalImages = [
      '/src/assets/modern-workspace.jpeg',
      '/src/assets/godiva-logo.png',
    ];
    
    // We use Promise.all to load these in parallel
    Promise.all(criticalImages.map(src => preloadImage(src)))
      .catch(err => console.error('Failed to preload hero images:', err));
    
    // Preconnect to domains we'll load resources from in the hero section
    preconnect('https://fonts.googleapis.com');
    preconnect('https://fonts.gstatic.com');
    preconnect('https://res.cloudinary.com');
    
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default PreloadHeroResources;