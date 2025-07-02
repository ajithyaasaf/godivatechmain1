#!/usr/bin/env node

/**
 * Static Sitemap Generator for Frontend Deployment
 * Generates sitemap.xml files that can be deployed with static frontend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://www.godivatech.com';

// Define static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.9', changefreq: 'monthly' },
  { url: '/services', priority: '0.9', changefreq: 'weekly' },
  { url: '/portfolio', priority: '0.8', changefreq: 'weekly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/admin', priority: '0.3', changefreq: 'never' },
];

// Service pages
const servicePages = [
  { url: '/services/web-development', priority: '0.8', changefreq: 'monthly' },
  { url: '/services/digital-marketing', priority: '0.8', changefreq: 'monthly' },
  { url: '/services/app-development', priority: '0.8', changefreq: 'monthly' },
  { url: '/services/poster-design', priority: '0.7', changefreq: 'monthly' },
  { url: '/services/ui-ux-design', priority: '0.8', changefreq: 'monthly' },
  { url: '/services/logo-brand-design', priority: '0.7', changefreq: 'monthly' },
];

// Fetch dynamic content from API
async function fetchDynamicContent() {
  const dynamicPages = [];
  const BACKEND_URL = 'https://godivatech-backend.onrender.com';
  
  try {
    // Fetch blog posts from backend
    const blogResponse = await fetch(`${BACKEND_URL}/api/blog-posts`);
    if (blogResponse.ok) {
      const blogPosts = await blogResponse.json();
      console.log(`Found ${blogPosts.length} blog posts`);
      blogPosts.forEach(post => {
        if (post.slug) {
          dynamicPages.push({
            url: `/blog/${post.slug}`,
            priority: '0.6',
            changefreq: 'weekly',
            lastmod: new Date(post.publishedAt || post.createdAt).toISOString().split('T')[0]
          });
        }
      });
    }
  } catch (error) {
    console.log('Could not fetch blog posts from backend, using static content only');
  }

  try {
    // Fetch projects from backend
    const projectsResponse = await fetch(`${BACKEND_URL}/api/projects`);
    if (projectsResponse.ok) {
      const projects = await projectsResponse.json();
      console.log(`Found ${projects.length} projects`);
      projects.forEach(project => {
        if (project.slug) {
          dynamicPages.push({
            url: `/portfolio/${project.slug}`,
            priority: '0.7',
            changefreq: 'monthly',
            lastmod: new Date(project.createdAt).toISOString().split('T')[0]
          });
        }
      });
    }
  } catch (error) {
    console.log('Could not fetch projects from backend, using static content only');
  }

  try {
    // Fetch services from backend
    const servicesResponse = await fetch(`${BACKEND_URL}/api/services`);
    if (servicesResponse.ok) {
      const services = await servicesResponse.json();
      console.log(`Found ${services.length} services`);
      services.forEach(service => {
        if (service.slug) {
          dynamicPages.push({
            url: `/services/${service.slug}`,
            priority: '0.8',
            changefreq: 'monthly',
            lastmod: new Date(service.createdAt || new Date()).toISOString().split('T')[0]
          });
        }
      });
    }
  } catch (error) {
    console.log('Could not fetch services from backend, using static content only');
  }

  return dynamicPages;
}

// Generate XML sitemap
function generateSitemapXML(pages) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod || currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate robots.txt
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Disallow admin areas
Disallow: /admin
Disallow: /api/

# Allow common assets
Allow: /assets/
Allow: /images/
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp

# Crawl delay
Crawl-delay: 1`;
}

// Main function
async function generateStaticSitemap() {
  console.log('🗺️  Generating static sitemap for frontend deployment...');
  
  try {
    // Combine all pages
    const dynamicPages = await fetchDynamicContent();
    const allPages = [...staticPages, ...servicePages, ...dynamicPages];
    
    console.log(`📄 Found ${allPages.length} pages for sitemap`);
    
    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(allPages);
    
    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    
    // Ensure public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write sitemap.xml
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
    console.log(`✅ Generated sitemap.xml (${allPages.length} URLs)`);
    
    // Write robots.txt
    const robotsPath = path.join(publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log('✅ Generated robots.txt');
    
    // Also copy to client/public for Vite builds
    const clientPublicDir = path.join(__dirname, '..', 'client', 'public');
    if (fs.existsSync(clientPublicDir)) {
      fs.writeFileSync(path.join(clientPublicDir, 'sitemap.xml'), sitemapXML, 'utf8');
      fs.writeFileSync(path.join(clientPublicDir, 'robots.txt'), robotsTxt, 'utf8');
      console.log('✅ Copied files to client/public');
    }
    
    console.log('🎉 Static sitemap generation complete!');
    console.log(`   Sitemap URL: ${SITE_URL}/sitemap.xml`);
    console.log(`   Robots URL: ${SITE_URL}/robots.txt`);
    
  } catch (error) {
    console.error('❌ Error generating static sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateStaticSitemap();
}

export { generateStaticSitemap };