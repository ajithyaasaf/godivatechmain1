#!/usr/bin/env node

/**
 * Build verification script for Vercel deployment
 * Ensures CSS is properly generated and critical styles are available
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying build output...');

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Build failed: dist directory not found');
  process.exit(1);
}

// Check for CSS files
const cssFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.css'));

if (cssFiles.length === 0) {
  console.error('❌ Build verification failed: No CSS files found in assets');
  console.log('📋 Available files:', fs.readdirSync(assetsDir));
  process.exit(1);
}

console.log('✅ Found CSS files:', cssFiles);

// Verify CSS content contains Tailwind classes
const cssFile = path.join(assetsDir, cssFiles[0]);
const cssContent = fs.readFileSync(cssFile, 'utf8');

const requiredClasses = [
  '.container',
  '.grid',
  '.flex',
  '.text-center',
  '.font-bold',
  '.bg-'
];

const missingClasses = requiredClasses.filter(className => 
  !cssContent.includes(className)
);

if (missingClasses.length > 0) {
  console.warn('⚠️  Warning: Some Tailwind classes missing:', missingClasses);
} else {
  console.log('✅ Tailwind CSS classes verified in build output');
}

// Check index.html for CSS links
const indexPath = path.join(distDir, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (!indexContent.includes('.css')) {
  console.error('❌ Build verification failed: No CSS links found in index.html');
  process.exit(1);
}

console.log('✅ CSS links found in index.html');
console.log('🎉 Build verification completed successfully!');
console.log('📁 CSS file size:', Math.round(fs.statSync(cssFile).size / 1024) + 'KB');