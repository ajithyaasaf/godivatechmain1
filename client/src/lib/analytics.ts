// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Add Google Analytics script to the head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      send_page_view: false // We'll handle this manually for better SPA support
    });
  `;
  document.head.appendChild(script2);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url,
    page_title: title
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number,
  nonInteraction: boolean = false,
  customParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    non_interaction: nonInteraction,
    ...customParams
  });
};

// Track outbound links
export const trackOutboundLink = (url: string, label: string = 'outbound') => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'click', {
    event_category: 'outbound',
    event_label: label,
    transport_type: 'beacon',
    event_callback: () => {
      document.location = url as unknown as Location;
    }
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent(
    success ? 'form_submission_success' : 'form_submission_failure',
    'engagement',
    formName
  );
};

// Track content visibility (for scroll depth analysis)
export const trackContentVisibility = (contentId: string, contentType: string, percentVisible: number = 100) => {
  trackEvent(
    'content_visible',
    'engagement',
    contentId,
    percentVisible
  );
};

// Track search queries
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent(
    'search',
    'engagement',
    searchTerm,
    resultsCount
  );
};

// Track file downloads
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent(
    'download',
    'engagement',
    `${fileName}.${fileType}`
  );
};

// Track scroll depth
export const trackScrollDepth = (scrollDepth: number) => {
  // Only track at specific breakpoints (25%, 50%, 75%, 100%)
  const breakpoints = [25, 50, 75, 100];
  const closestBreakpoint = breakpoints.reduce((prev, curr) => {
    return (Math.abs(curr - scrollDepth) < Math.abs(prev - scrollDepth) ? curr : prev);
  });
  
  if (scrollDepth >= closestBreakpoint) {
    trackEvent(
      'scroll_depth',
      'engagement',
      `Scrolled ${closestBreakpoint}%`,
      closestBreakpoint,
      true // Non-interaction event
    );
  }
};

// Track time on page
export const trackTimeOnPage = () => {
  let startTime = Date.now();
  
  window.addEventListener('beforeunload', () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // Time in seconds
    
    trackEvent(
      'time_on_page',
      'engagement',
      `${window.location.pathname}`,
      timeSpent,
      true // Non-interaction event
    );
  });
};

// Special SEO-focused tracking functions
export const seoTracking = {
  // Track Core Web Vitals metrics for SEO performance analysis
  trackCoreWebVitals: () => {
    if ('web-vitals' in window) {
      try {
        // @ts-ignore - web-vitals library might not be available
        const { getLCP, getFID, getCLS } = window['web-vitals'];
        
        getLCP((metric: any) => {
          trackEvent(
            'web_vitals',
            'performance',
            'LCP',
            Math.round(metric.value),
            true,
            { metric_name: 'LCP', metric_value: metric.value }
          );
        });
        
        getFID((metric: any) => {
          trackEvent(
            'web_vitals',
            'performance',
            'FID',
            Math.round(metric.value),
            true,
            { metric_name: 'FID', metric_value: metric.value }
          );
        });
        
        getCLS((metric: any) => {
          trackEvent(
            'web_vitals',
            'performance',
            'CLS',
            Math.round(metric.value * 1000) / 1000,
            true,
            { metric_name: 'CLS', metric_value: metric.value }
          );
        });
      } catch (error) {
        console.error('Error tracking Core Web Vitals:', error);
      }
    }
  },
  
  // Track structured data engagement (for rich snippets)
  trackStructuredDataEngagement: (schemaType: string, elementId: string) => {
    trackEvent(
      'structured_data_engagement',
      'seo',
      `${schemaType}_${elementId}`,
      undefined,
      false,
      { schema_type: schemaType, element_id: elementId }
    );
  }
};