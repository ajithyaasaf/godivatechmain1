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
        
        // Generate appropriate page title based on path - SEO Optimized (50-60 chars)
        let title = 'Web Development & Digital Marketing Services Madurai';
        let description = "Leading web development, digital marketing & design company in Madurai. Expert solutions & services for business growth. Get your free quote today!";
        
        // Set specific titles and descriptions based on routes - SEO Optimized
        if (url.startsWith('/services')) {
          title = 'Web Development & Digital Marketing Services | Madurai';
          description = 'Boost your business 3x with our proven web development & digital marketing services in Madurai. Starting ₹15,000. Get instant quote!';
        } else if (url.startsWith('/portfolio')) {
          title = 'Web Development Portfolio | Digital Marketing Cases';
          description = 'View our web development portfolio showcasing digital marketing solutions, design projects & development work. See results for Madurai businesses.';
        } else if (url.startsWith('/about')) {
          title = 'About GodivaTech | Web Development & Design Company';
          description = 'Leading web development & design company in Madurai. Expert solutions for digital marketing, custom development services & business growth.';
        } else if (url.startsWith('/blog')) {
          title = 'Web Development Blog | Digital Marketing Solutions';
          description = 'Expert insights on web development, digital marketing & design solutions. Learn from Madurai\'s top development & marketing professionals.';
        } else if (url.startsWith('/contact')) {
          title = 'Contact Us | Web Development & Marketing Services';
          description = 'Get in touch for web development, digital marketing & design services in Madurai. Free consultation for your business solutions needs.';
        }
        
        // Generate keywords based on page content
        let keywords = 'web development, digital marketing, design solutions, madurai, services, business growth, website design, app development, seo, branding';
        
        if (url.startsWith('/services')) {
          keywords = 'web development services, digital marketing services, design solutions, madurai development, web solutions, app development, seo services, marketing solutions';
        } else if (url.startsWith('/portfolio')) {
          keywords = 'web development portfolio, digital marketing cases, design projects, madurai web solutions, development work, marketing results, web design portfolio';
        } else if (url.startsWith('/about')) {
          keywords = 'web development company, digital marketing agency, design company madurai, development team, marketing experts, web solutions provider';
        } else if (url.startsWith('/blog')) {
          keywords = 'web development blog, digital marketing insights, design tips, development tutorials, marketing strategies, madurai tech blog';
        } else if (url.startsWith('/contact')) {
          keywords = 'contact web development, digital marketing consultation, design services contact, madurai web solutions, development inquiry';
        }

        // Use the meta tag injector to ensure proper SEO tags
        body = injectMetaTags(body, {
          title,
          description,
          canonicalUrl,
          keywords,
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