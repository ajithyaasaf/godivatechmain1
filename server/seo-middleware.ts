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
        
        // Generate appropriate page title based on path
        let title = 'GodivaTech - Web Development & Digital Marketing Services in Madurai';
        let description = "GodivaTech offers quality web development, digital marketing, and app services in Madurai at competitive prices. Get custom solutions for your business.";
        
        // Set specific titles and descriptions based on routes
        if (url.startsWith('/services')) {
          title = 'Our Services - Web, App & Digital Marketing Solutions | GodivaTech Madurai';
          description = 'Explore our comprehensive range of professional web development, mobile app, and digital marketing services in Madurai, Tamil Nadu. Affordable solutions for businesses.';
        } else if (url.startsWith('/portfolio')) {
          title = 'Our Portfolio - Successful Web & App Projects | GodivaTech Madurai';
          description = 'View our portfolio of successful web development, app development, and digital marketing projects. See how we have helped businesses in Madurai achieve digital excellence.';
        } else if (url.startsWith('/about')) {
          title = 'About GodivaTech - Leading Web Development Company in Madurai';
          description = 'Learn about GodivaTech, a leading web development and digital marketing company in Madurai. Know our mission, vision, and the expert team behind our quality services.';
        } else if (url.startsWith('/blog')) {
          title = 'Blog - Latest Web Development & Digital Marketing Insights | GodivaTech';
          description = 'Read our blog for the latest insights, tips, and trends in web development, digital marketing, and technology. Expert advice from Madurai tech companies.';
        } else if (url.startsWith('/contact')) {
          title = 'Contact Us - Get Web Development & Digital Marketing Services | GodivaTech';
          description = 'Contact GodivaTech for professional web development, digital marketing, and app development services in Madurai. Get a free consultation for your business needs.';
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