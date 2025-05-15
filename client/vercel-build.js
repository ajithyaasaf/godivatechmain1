#!/usr/bin/env node

/**
 * This script handles the Vercel build process
 * It's called by Vercel's build command in the package.json
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log start of build
console.log('🚀 Starting build process for GodivaTech client...');
console.log('📂 Current directory:', __dirname);

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Run the Vite build using the Vercel-specific config
  console.log('🔨 Building the client with Vite...');
  execSync('vite build --config vite.config.vercel.ts', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}