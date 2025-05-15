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
      send_page_view: false,
      cookie_domain: 'auto',
      cookie_flags: 'samesite=none;secure',
      anonymize_ip: true  // GDPR friendly setting
    });
  `;
  document.head.appendChild(script2);
  
  console.log(`Google Analytics initialized with ID: ${measurementId}`);
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  // Track the page view with Google Analytics 4
  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href
  });
};

// Track events with enhanced parameters for better SEO analysis
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number,
  nonInteraction: boolean = false,
  additionalParams: Record<string, any> = {}
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Prepare event parameters
  const eventParams = {
    event_category: category,
    event_label: label,
    value: value,
    non_interaction: nonInteraction,
    ...additionalParams
  };
  
  // Send event to Google Analytics
  window.gtag('event', action, eventParams);
};

// Track outbound links - important for SEO to understand referral traffic
export const trackOutboundLink = (url: string, label: string = 'outbound') => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  trackEvent('click', 'outbound', label);
  
  // If it's an outbound link that opens in the same tab, delay navigation to ensure tracking
  if (url && url.indexOf('http') === 0 && !url.includes(window.location.hostname)) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
    return false;
  }
  
  return true;
};

// Track form submissions - important for conversion tracking
export const trackFormSubmission = (formName: string, success: boolean = true) => {
  trackEvent(
    success ? 'form_submit_success' : 'form_submit_failure',
    'engagement',
    formName,
    undefined,
    false,
    { form_name: formName }
  );
};

// Track content visibility - helps understand what content users see
export const trackContentVisibility = (contentId: string, contentType: string, percentVisible: number = 100) => {
  trackEvent(
    'content_visible',
    'engagement',
    contentId,
    undefined,
    true,
    { 
      content_type: contentType,
      percent_visible: percentVisible
    }
  );
};

// Track search terms - critical for SEO keyword research
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

// Track file downloads - useful for content engagement metrics
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent(
    'file_download',
    'engagement',
    fileName,
    undefined,
    false,
    { file_type: fileType }
  );
};

// Track scroll depth - helps understand content engagement
export const trackScrollDepth = (scrollDepth: number) => {
  // Only track at significant thresholds to avoid excessive events
  if ([25, 50, 75, 90, 100].includes(scrollDepth)) {
    trackEvent(
      'scroll_depth',
      'engagement',
      `Scrolled ${scrollDepth}%`,
      scrollDepth,
      true
    );
  }
};

// Track time on page - helps understand content quality
let startTime = Date.now();
export const trackTimeOnPage = () => {
  if (typeof window === 'undefined') return;

  const timeSpent = Math.round((Date.now() - startTime) / 1000);
  
  // Track time spent on page when user leaves
  window.addEventListener('beforeunload', () => {
    trackEvent(
      'time_on_page',
      'engagement',
      `${timeSpent} seconds`,
      timeSpent,
      true
    );
  });
};

// SEO-specific tracking helpers
export const seoTracking = {
  // Track schema.org impressions
  trackStructuredDataImpression: (schemaType: string) => {
    trackEvent('structured_data_impression', 'seo', schemaType, undefined, true);
  },
  
  // Track canonical URL efficacy
  trackCanonicalUsage: () => {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.getAttribute('href')) {
      trackEvent(
        'canonical_url_present', 
        'seo', 
        canonical.getAttribute('href') || 'unknown', 
        undefined, 
        true
      );
    }
  },
  
  // Track meta tag presence and optimization
  trackMetaTagStatus: () => {
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    
    if (metaDescription) {
      const description = metaDescription.getAttribute('content') || '';
      trackEvent(
        'meta_description_present', 
        'seo', 
        `Length: ${description.length}`, 
        description.length, 
        true
      );
    }
    
    if (metaKeywords) {
      const keywords = (metaKeywords.getAttribute('content') || '').split(',').length;
      trackEvent('meta_keywords_present', 'seo', `Count: ${keywords}`, keywords, true);
    }
  }
};