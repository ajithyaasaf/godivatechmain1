import { Request, Response, NextFunction } from 'express';
import { injectMetaTags } from './meta-tags';

/**
 * A middleware to ensure every page has proper SEO tags
 * This will add or update canonical URLs, meta descriptions, and other SEO elements
 * for production-ready SEO implementation
 */
export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Store the original send method
  const originalSend = res.send;
  
  // Override the send method
  res.send = function(body: any) {
    // Only process HTML responses
    if (typeof body === 'string' && body.includes('<!DOCTYPE html>') && !req.path.startsWith('/api')) {
      try {
        // Get the current URL path
        const url = req.originalUrl || req.url;
        const baseUrl = process.env.BASE_URL || 'https://godivatech.com';
        const canonicalUrl = `${baseUrl}${url === '/' ? '' : url}`;
        
        // Generate appropriate page title based on path - CTR Optimized
        let title = '🚀 Best Web Development Company Madurai | Transform Your Business | Free Quote 24hrs';
        let description = "🚀 Best web development company in Madurai! Transform your business with stunning websites & apps. 500+ clients served. Free quote in 24hrs!";
        
        // Set specific titles and descriptions based on routes - Optimized for CTR
        if (url.startsWith('/services')) {
          title = '🎯 Boost Your Business 3x | Web Development & Digital Marketing Services Madurai';
          description = 'Boost your business 3x with our proven web development & digital marketing services in Madurai. Starting ₹15,000. Get instant quote!';
        } else if (url.startsWith('/portfolio')) {
          title = '💼 Amazing Results Portfolio | 200%+ Revenue Growth | GodivaTech Madurai';
          description = 'Amazing results! See how we increased client revenue by 200%+ with custom websites & apps in Madurai. 500+ success stories inside.';
        } else if (url.startsWith('/about')) {
          title = '🏆 Award-Winning Web Developers | 99% Client Satisfaction | Madurai';
          description = 'Award-winning web developers in Madurai with 99% client satisfaction. 5+ years experience, 500+ projects delivered. See why businesses choose us!';
        } else if (url.startsWith('/blog')) {
          title = '📈 Insider Secrets to 10x Website Traffic | Expert Tips | GodivaTech Blog';
          description = 'Discover insider secrets to boost website traffic & sales! Expert tips from Madurai\'s top web developers. New articles weekly.';
        } else if (url.startsWith('/contact')) {
          title = '📞 FREE Website Audit | 10x Your Business | Call +91 96005 20130';
          description = 'Ready to 10x your business? Get a FREE website audit & consultation from Madurai\'s #1 web development team. Call now: +91 96005 20130!';
        }
        
        // Use the meta tag injector to ensure proper SEO tags
        body = injectMetaTags(body, {
          title,
          description,
          canonicalUrl,
          ogType: url === '/' ? 'website' : 'article',
          ogImage: `${baseUrl}/og-image.jpg`,
        });
        
        // Log for debugging
        console.log(`[SEO] Enhanced meta tags for ${url}`);
      } catch (error) {
        console.error('Error in SEO middleware:', error);
        // Continue with the original HTML if there's an error
      }
    }
    
    // Call the original send method
    return originalSend.call(this, body);
  };
  
  next();
}