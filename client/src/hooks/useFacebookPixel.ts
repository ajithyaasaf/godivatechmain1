/**
 * React Hook for Facebook Pixel Integration
 * Provides easy access to Facebook Pixel tracking methods
 */

import { useEffect } from 'react';
import { FacebookPixelService } from '@/lib/facebook-pixel';

export const useFacebookPixel = () => {
  useEffect(() => {
    FacebookPixelService.init();
  }, []);

  return {
    trackPageView: (pageName?: string) => FacebookPixelService.trackPageView(pageName),
    trackContact: () => FacebookPixelService.trackContact(),
    trackLead: (service?: string) => FacebookPixelService.trackLead(service),
    trackViewContent: (contentName: string, contentType?: string) => 
      FacebookPixelService.trackViewContent(contentName, contentType),
    trackQuoteRequest: (service: string, value?: number) => 
      FacebookPixelService.trackInitiateCheckout(service, value),
  };
};

/**
 * Hook for tracking page views automatically
 */
export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useFacebookPixel();

  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
};