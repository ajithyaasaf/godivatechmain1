#!/bin/bash

# Frontend Build Script with Static Sitemap Generation
# This script generates static sitemap files and builds the frontend

echo "🚀 Starting frontend build process..."

# Step 1: Generate static sitemap and robots.txt
echo "📄 Generating static sitemap..."
node scripts/generate-static-sitemap.js

# Step 2: Ensure client/public directory exists
mkdir -p client/public

# Step 3: Copy sitemap files to client/public for Vite build
echo "📁 Copying sitemap files to client/public..."
cp public/sitemap.xml client/public/
cp public/robots.txt client/public/

# Step 4: Build the frontend
echo "🏗️  Building frontend..."
cd client && npm run build

echo "✅ Frontend build complete!"
echo ""
echo "📋 Next steps for deployment:"
echo "1. Deploy the client/dist directory to your hosting platform"
echo "2. Ensure sitemap.xml and robots.txt are served at root level"
echo "3. Verify sitemap is accessible at https://www.godivatech.com/sitemap.xml"