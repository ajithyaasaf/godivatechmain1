/**
 * Enhanced Sitemap Generator with Sharding and Dynamic Priorities
 * Creates multiple sitemaps for better SEO performance and crawlability
 */

import { Request, Response, Express } from 'express';
import { firestoreStorage } from './firestore-storage';

// Sitemap configuration
const BASE_URL = process.env.BASE_URL || 'https://godivatech.com';
const CURRENT_DATE = new Date().toISOString();

// Dynamic priority calculation based on content importance and activity
interface URLPriority {
  url: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod: string;
  images?: string[];
}

// Simulate Search Console data for priority calculation
const simulateSearchConsoleData = (url: string, contentType: 'static' | 'blog' | 'service' | 'project'): { clicks: number; impressions: number } => {
  // Simulate realistic data based on content type and URL importance
  const baseMetrics = {
    static: { clicks: 150, impressions: 2000 },
    blog: { clicks: 75, impressions: 1200 },
    service: { clicks: 200, impressions: 2500 },
    project: { clicks: 50, impressions: 800 }
  };

  // Homepage gets higher metrics
  if (url === '/') {
    return { clicks: 500, impressions: 8000 };
  }

  // Contact and services get higher priority
  if (url.includes('/contact') || url.includes('/services')) {
    return { clicks: 300, impressions: 4000 };
  }

  return baseMetrics[contentType];
};

// Calculate dynamic priority based on simulated metrics
const calculateDynamicPriority = (url: string, contentType: 'static' | 'blog' | 'service' | 'project', lastUpdated?: Date): URLPriority => {
  const metrics = simulateSearchConsoleData(url, contentType);
  
  // Priority calculation based on clicks and impressions
  let priority = 0.5;
  if (metrics.clicks > 400) priority = 1.0;
  else if (metrics.clicks > 200) priority = 0.9;
  else if (metrics.clicks > 100) priority = 0.8;
  else if (metrics.clicks > 50) priority = 0.7;
  else if (metrics.clicks > 20) priority = 0.6;
  else priority = 0.5;

  // Changefreq based on content type and recent updates
  let changefreq: URLPriority['changefreq'] = 'monthly';
  const daysSinceUpdate = lastUpdated ? 
    Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)) : 999;

  if (contentType === 'blog') {
    changefreq = daysSinceUpdate < 7 ? 'daily' : daysSinceUpdate < 30 ? 'weekly' : 'monthly';
  } else if (contentType === 'service') {
    changefreq = daysSinceUpdate < 30 ? 'weekly' : 'monthly';
  } else if (contentType === 'project') {
    changefreq = daysSinceUpdate < 60 ? 'monthly' : 'yearly';
  } else if (url === '/' || url.includes('/contact')) {
    changefreq = 'weekly';
  }

  return {
    url: `${BASE_URL}${url}`,
    priority,
    changefreq,
    lastmod: lastUpdated ? lastUpdated.toISOString() : CURRENT_DATE
  };
};

// Generate static pages sitemap
export const generateStaticSitemap = (): string => {
  const staticPages = [
    { url: '/', title: 'Homepage' },
    { url: '/about', title: 'About Us' },
    { url: '/contact', title: 'Contact Us' },
    { url: '/portfolio', title: 'Portfolio' },
    { url: '/services', title: 'Services Overview' }
  ];

  const urls = staticPages.map(page => {
    const urlData = calculateDynamicPriority(page.url, 'static');
    return `
  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${urlData.url}"></xhtml:link>
    <xhtml:link rel="alternate" hreflang="ta-IN" href="${urlData.url}"></xhtml:link>
    <mobile:mobile></mobile:mobile>
  </url>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${urls}
</urlset>`;
};

// Generate blog posts sitemap
export const generateBlogSitemap = async (): Promise<string> => {
  try {
    const blogPosts = await firestoreStorage.getAllBlogPosts();
    const categories = await firestoreStorage.getAllCategories();

    const blogUrls = blogPosts.map(post => {
      const urlData = calculateDynamicPriority(`/blog/${post.slug}`, 'blog', post.publishedAt);
      return `
  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${urlData.url}"></xhtml:link>
    <xhtml:link rel="alternate" hreflang="ta-IN" href="${urlData.url}"></xhtml:link>
    <mobile:mobile></mobile:mobile>
  </url>`;
    }).join('');

    const categoryUrls = categories.map(category => {
      const urlData = calculateDynamicPriority(`/blog/category/${category.slug}`, 'blog');
      return `
  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${urlData.url}"></xhtml:link>
    <xhtml:link rel="alternate" hreflang="ta-IN" href="${urlData.url}"></xhtml:link>
    <mobile:mobile></mobile:mobile>
  </url>`;
    }).join('');

    // Add main blog page
    const mainBlogUrl = calculateDynamicPriority('/blog', 'blog');
    const mainBlogEntry = `
  <url>
    <loc>${mainBlogUrl.url}</loc>
    <lastmod>${mainBlogUrl.lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${mainBlogUrl.url}"></xhtml:link>
    <xhtml:link rel="alternate" hreflang="ta-IN" href="${mainBlogUrl.url}"></xhtml:link>
    <mobile:mobile></mobile:mobile>
  </url>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${mainBlogEntry}${blogUrls}${categoryUrls}
</urlset>`;

  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
  }
};

// Generate services sitemap  
export const generateServicesSitemap = async (): Promise<string> => {
  try {
    const services = await firestoreStorage.getAllServices();

    const serviceUrls = services.map(service => {
      const urlData = calculateDynamicPriority(`/services/${service.slug}`, 'service');
      return `
  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${urlData.url}"></xhtml:link>
    <xhtml:link rel="alternate" hreflang="ta-IN" href="${urlData.url}"></xhtml:link>
    <mobile:mobile></mobile:mobile>
  </url>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${serviceUrls}
</urlset>`;

  } catch (error) {
    console.error('Error generating services sitemap:', error);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
  }
};

// Generate projects sitemap
export const generateProjectsSitemap = async (): Promise<string> => {
  try {
    const projects = await firestoreStorage.getAllProjects();

    const projectUrls = projects.map(project => {
      // Use project ID for URL since projects don't have a slug field
      const urlData = calculateDynamicPriority(`/portfolio/${project.id}`, 'project');
      return `
  <url>
    <loc>${urlData.url}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${urlData.url}"></xhtml:link>
    <xhtml:link rel="alternate" hreflang="ta-IN" href="${urlData.url}"></xhtml:link>
    <mobile:mobile></mobile:mobile>
  </url>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">${projectUrls}
</urlset>`;

  } catch (error) {
    console.error('Error generating projects sitemap:', error);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
  }
};

// Generate sitemap index
export const generateSitemapIndex = (): string => {
  const sitemaps = [
    { loc: `${BASE_URL}/sitemap-static.xml`, lastmod: CURRENT_DATE },
    { loc: `${BASE_URL}/sitemap-blog.xml`, lastmod: CURRENT_DATE },
    { loc: `${BASE_URL}/sitemap-services.xml`, lastmod: CURRENT_DATE },
    { loc: `${BASE_URL}/sitemap-projects.xml`, lastmod: CURRENT_DATE }
  ];

  const sitemapEntries = sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                                 http://www.sitemaps.org/schemas/sitemap/0.9/siteindex.xsd">${sitemapEntries}
</sitemapindex>`;
};

// Validate XML syntax
export const validateXMLSyntax = (xml: string): { isValid: boolean; error?: string } => {
  try {
    // Basic XML validation
    if (!xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      return { isValid: false, error: 'Missing XML declaration' };
    }
    
    // Check for matching tags
    const openTags = xml.match(/<[^/][^>]*>/g) || [];
    const closeTags = xml.match(/<\/[^>]+>/g) || [];
    
    if (openTags.length !== closeTags.length + 1) { // +1 for self-closing tags
      return { isValid: false, error: 'Mismatched XML tags' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: String(error) };
  }
};

// Setup enhanced sitemap routes
export const setupEnhancedSitemaps = (app: Express): void => {
  // Sitemap index
  app.get('/sitemap-index.xml', async (req: Request, res: Response) => {
    try {
      const sitemapIndex = generateSitemapIndex();
      const validation = validateXMLSyntax(sitemapIndex);
      
      if (!validation.isValid) {
        console.error('Sitemap index validation failed:', validation.error);
        return res.status(500).send('Sitemap generation error');
      }

      res.set({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Robots-Tag': 'noindex'
      });
      
      res.send(sitemapIndex);
    } catch (error) {
      console.error('Error generating sitemap index:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Static sitemap
  app.get('/sitemap-static.xml', async (req: Request, res: Response) => {
    try {
      const staticSitemap = generateStaticSitemap();
      const validation = validateXMLSyntax(staticSitemap);
      
      if (!validation.isValid) {
        console.error('Static sitemap validation failed:', validation.error);
        return res.status(500).send('Sitemap generation error');
      }

      res.set({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'X-Robots-Tag': 'noindex'
      });
      
      res.send(staticSitemap);
    } catch (error) {
      console.error('Error generating static sitemap:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Blog sitemap
  app.get('/sitemap-blog.xml', async (req: Request, res: Response) => {
    try {
      const blogSitemap = await generateBlogSitemap();
      const validation = validateXMLSyntax(blogSitemap);
      
      if (!validation.isValid) {
        console.error('Blog sitemap validation failed:', validation.error);
        return res.status(500).send('Sitemap generation error');
      }

      res.set({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600',
        'X-Robots-Tag': 'noindex'
      });
      
      res.send(blogSitemap);
    } catch (error) {
      console.error('Error generating blog sitemap:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Services sitemap
  app.get('/sitemap-services.xml', async (req: Request, res: Response) => {
    try {
      const servicesSitemap = await generateServicesSitemap();
      const validation = validateXMLSyntax(servicesSitemap);
      
      if (!validation.isValid) {
        console.error('Services sitemap validation failed:', validation.error);
        return res.status(500).send('Sitemap generation error');
      }

      res.set({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=7200, s-maxage=14400',
        'X-Robots-Tag': 'noindex'
      });
      
      res.send(servicesSitemap);
    } catch (error) {
      console.error('Error generating services sitemap:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Projects sitemap
  app.get('/sitemap-projects.xml', async (req: Request, res: Response) => {
    try {
      const projectsSitemap = await generateProjectsSitemap();
      const validation = validateXMLSyntax(projectsSitemap);
      
      if (!validation.isValid) {
        console.error('Projects sitemap validation failed:', validation.error);
        return res.status(500).send('Sitemap generation error');
      }

      res.set({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=14400, s-maxage=28800',
        'X-Robots-Tag': 'noindex'
      });
      
      res.send(projectsSitemap);
    } catch (error) {
      console.error('Error generating projects sitemap:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Keep original sitemap.xml pointing to sitemap-index.xml for backward compatibility
  app.get('/sitemap.xml', (req: Request, res: Response) => {
    res.redirect(301, '/sitemap-index.xml');
  });
};

// Ping Google about sitemap updates
export const pingGoogleSitemap = async (): Promise<boolean> => {
  try {
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(BASE_URL + '/sitemap-index.xml')}`;
    const response = await fetch(pingUrl);
    
    if (response.ok) {
      console.log('Successfully pinged Google about sitemap update');
      return true;
    } else {
      console.error('Failed to ping Google:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error pinging Google:', error);
    return false;
  }
};