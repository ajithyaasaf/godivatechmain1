import { Express, Request, Response } from 'express';
import { firestoreStorage } from './firestore-storage';

/**
 * Sitemap generator with location-based priority settings for GodivaTech
 * This module generates dynamic XML sitemaps for better search engine indexing
 */

// Base URL for the site
const baseUrl = 'https://godivatech.com';

// Last modified date formatter
const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString();
};

// Generate XML sitemap
export const generateSitemap = async (): Promise<string> => {
  try {
    // Get dynamic content from Firestore
    const [blogPosts, categories, services, projects] = await Promise.all([
      firestoreStorage.getAllBlogPosts(),
      firestoreStorage.getAllCategories(),
      firestoreStorage.getAllServices(),
      firestoreStorage.getAllProjects()
    ]);

    // Start building the XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ';
    xml += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
    xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ';
    xml += 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" ';
    xml += 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" ';
    xml += 'xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" ';
    xml += 'xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0" ';
    xml += 'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    // Madurai specific locations for hreflang targeting
    const locations = [
      { code: 'en-IN', name: 'Madurai' },
      { code: 'ta-IN', name: 'மதுரை' },  // Tamil version
    ];

    // Static pages with priorities
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/services', priority: 0.9, changefreq: 'weekly' },
      { url: '/portfolio', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.8, changefreq: 'daily' },
      { url: '/contact', priority: 0.7, changefreq: 'monthly' },
      // Madurai neighborhood targeting for SEO
      { url: '/madurai/anna-nagar', priority: 0.7, changefreq: 'monthly' },
      { url: '/madurai/iyer-bungalow', priority: 0.7, changefreq: 'monthly' },
      { url: '/madurai/kk-nagar', priority: 0.7, changefreq: 'monthly' },
      { url: '/madurai/ss-colony', priority: 0.7, changefreq: 'monthly' },
      { url: '/madurai/tirunagar', priority: 0.7, changefreq: 'monthly' },
      { url: '/tamil-nadu', priority: 0.6, changefreq: 'monthly' },
    ];

    // Add static pages
    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      
      // Add alternate language/location versions
      locations.forEach(location => {
        xml += `    <xhtml:link rel="alternate" hreflang="${location.code}" href="${baseUrl}${page.url}" />\n`;
      });

      // Add mobile specific indicator
      xml += '    <mobile:mobile/>\n';
      xml += '  </url>\n';
    });

    // Add blog posts
    blogPosts.forEach(post => {
      const postUrl = `/blog/${post.slug}`;
      // Use publishedAt as the update date, as updatedAt might not exist in all schemas
      const updateDate = post.publishedAt;
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${postUrl}</loc>\n`;
      xml += `    <lastmod>${formatDate(updateDate)}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      
      // Add AMP version indicator
      xml += `    <xhtml:link rel="alternate" media="only screen and (max-width: 640px)" href="${baseUrl}${postUrl}?amp=1" />\n`;
      
      // Add mobile specific indicator
      xml += '    <mobile:mobile/>\n';

      // Add image if available
      if (post.coverImage) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${post.coverImage}</image:loc>\n`;
        xml += `      <image:title>${post.title} | GodivaTech Madurai</image:title>\n`;
        xml += `      <image:caption>${post.excerpt}</image:caption>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';
    });

    // Add category pages
    categories.forEach(category => {
      const categoryUrl = `/blog/category/${category.slug}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${categoryUrl}</loc>\n`;
      xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '    <mobile:mobile/>\n';
      xml += '  </url>\n';
    });

    // Add service pages
    services.forEach(service => {
      const serviceUrl = `/services/${service.slug}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${serviceUrl}</loc>\n`;
      xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      
      // Add alternate language/location versions
      locations.forEach(location => {
        xml += `    <xhtml:link rel="alternate" hreflang="${location.code}" href="${baseUrl}${serviceUrl}" />\n`;
      });
      
      // Add mobile specific indicator
      xml += '    <mobile:mobile/>\n';
      
      // Add service image if available
      if (service.icon) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${service.icon}</image:loc>\n`;
        xml += `      <image:title>${service.title} in Madurai | GodivaTech</image:title>\n`;
        xml += `      <image:caption>Professional ${service.title} services in Madurai and Tamil Nadu</image:caption>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';

      // Add Madurai neighborhood targeting for each service
      ['anna-nagar', 'iyer-bungalow', 'kk-nagar', 'ss-colony', 'tirunagar'].forEach(area => {
        const areaServiceUrl = `/services/${service.slug}/madurai/${area}`;
        
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}${areaServiceUrl}</loc>\n`;
        xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '    <mobile:mobile/>\n';
        xml += '  </url>\n';
      });
      
      // Add Tamil Nadu targeting
      const tnServiceUrl = `/services/${service.slug}/tamil-nadu`;
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${tnServiceUrl}</loc>\n`;
      xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '    <mobile:mobile/>\n';
      xml += '  </url>\n';
    });

    // Add project pages with URL slug handling
    projects.forEach(project => {
      // Create a slug from title if not already present
      const slug = project.slug || project.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
      if (!slug) return; // Skip if we can't generate a slug
      
      const projectUrl = `/portfolio/${slug}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${projectUrl}</loc>\n`;
      xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '    <mobile:mobile/>\n';
      
      // Add project image if available 
      if (project.image) {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${project.image}</image:loc>\n`;
        xml += `      <image:title>${project.title} | GodivaTech Madurai Portfolio</image:title>\n`;
        xml += `      <image:caption>${project.description || project.title}</image:caption>\n`;
        xml += '    </image:image>\n';
      }
      
      xml += '  </url>\n';
    });

    // Close XML
    xml += '</urlset>';

    return xml;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return a basic sitemap with just static pages if there's an error
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>`;
  }
};

// Serve XML sitemap route
export const setupSitemap = (app: Express): void => {
  app.get('/sitemap.xml', async (_req: Request, res: Response) => {
    try {
      const sitemap = await generateSitemap();
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error serving sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });
};