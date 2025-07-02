#!/usr/bin/env node

/**
 * Deployment Sitemap Automation
 * Run this before deploying your frontend to ensure sitemap is up-to-date
 */

import { generateStaticSitemap } from './scripts/generate-static-sitemap.js';

async function deploySitemap() {
  console.log('🚀 Pre-deployment sitemap generation...');
  
  try {
    await generateStaticSitemap();
    
    console.log('\n✅ Deployment-ready sitemap generated!');
    console.log('\n📋 Deployment checklist:');
    console.log('   ✓ sitemap.xml generated with latest content');
    console.log('   ✓ robots.txt updated');
    console.log('   ✓ Files copied to client/public/');
    console.log('\n🎯 Next: Deploy client/dist folder to your hosting platform');
    console.log('   The sitemap will be available at: https://www.godivatech.com/sitemap.xml');
    
  } catch (error) {
    console.error('❌ Deployment sitemap generation failed:', error);
    process.exit(1);
  }
}

deploySitemap();