/**
 * Facebook Pixel Integration Service
 * Handles Facebook Pixel tracking events and conversions
 */

declare global {
  interface Window {
    fbq: any;
  }
}

export class FacebookPixelService {
  private static pixelId = 'YOUR_PIXEL_ID'; // Replace with actual Pixel ID
  private static initialized = false;

  /**
   * Initialize Facebook Pixel
   */
  static init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Check if fbq is available
    if (window.fbq) {
      this.initialized = true;
      console.log('Facebook Pixel initialized');
    }
  }

  /**
   * Track page view
   */
  static trackPageView(pageName?: string) {
    if (!this.isAvailable()) return;

    window.fbq('track', 'PageView');
    
    if (pageName) {
      console.log(`Facebook Pixel: PageView tracked for ${pageName}`);
    }
  }

  /**
   * Track contact form submission
   */
  static trackContact() {
    if (!this.isAvailable()) return;

    window.fbq('track', 'Contact');
    console.log('Facebook Pixel: Contact event tracked');
  }

  /**
   * Track service inquiry
   */
  static trackLead(service?: string) {
    if (!this.isAvailable()) return;

    window.fbq('track', 'Lead', {
      content_name: service || 'Web Development Service',
      content_category: 'Service Inquiry'
    });
    console.log(`Facebook Pixel: Lead tracked${service ? ` for ${service}` : ''}`);
  }

  /**
   * Track blog post view
   */
  static trackViewContent(contentName: string, contentType = 'blog') {
    if (!this.isAvailable()) return;

    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_type: contentType
    });
    console.log(`Facebook Pixel: ViewContent tracked for ${contentName}`);
  }

  /**
   * Track quote request
   */
  static trackInitiateCheckout(service: string, value?: number) {
    if (!this.isAvailable()) return;

    const eventData: any = {
      content_name: service,
      content_category: 'Service Request'
    };

    if (value) {
      eventData.value = value;
      eventData.currency = 'INR';
    }

    window.fbq('track', 'InitiateCheckout', eventData);
    console.log(`Facebook Pixel: InitiateCheckout tracked for ${service}`);
  }

  /**
   * Check if Facebook Pixel is available
   */
  private static isAvailable(): boolean {
    return typeof window !== 'undefined' && window.fbq && this.initialized;
  }

  /**
   * Set custom Pixel ID (for dynamic configuration)
   */
  static setPixelId(pixelId: string) {
    this.pixelId = pixelId;
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  FacebookPixelService.init();
}