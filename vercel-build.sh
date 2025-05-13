#!/bin/bash

# Display current directory and files
echo "Current directory: $(pwd)"
echo "Files in root directory:"
ls -la

# Install dependencies (ensure we have all required packages)
echo "Installing dependencies..."
npm install

# Run the Vercel-specific build for client
echo "Running client Vercel build..."
cd client && npm run vercel-build && cd ..

# Build server-side code for API routes
echo "Building API and server code..."
mkdir -p dist/api
cp -r api/* dist/api/
cp -r server dist/

# Copy schema files needed by the API
echo "Copying schema files..."
mkdir -p dist/shared
cp -r shared dist/

# Create .nojekyll file to prevent GitHub Pages from ignoring files with underscores
echo "Creating .nojekyll file..."
touch dist/.nojekyll

# Copy public files to dist directory
echo "Copying public files to dist directory..."
cp -r public/* dist/

# Create proper 404 page
echo "Creating 404 page..."
cp client/dist/index.html dist/404.html

# Copy static client files to main dist
echo "Copying client build to main dist..."
cp -r client/dist/* dist/

# Create Vercel specific headers and redirects
echo "Creating Vercel _headers file..."
cat > dist/_headers << EOF
/*
  Content-Type: text/html; charset=UTF-8
  X-Content-Type-Options: nosniff

/*.js
  Content-Type: application/javascript; charset=UTF-8

/*.css
  Content-Type: text/css; charset=UTF-8

/*.json
  Content-Type: application/json; charset=UTF-8
EOF

echo "Creating _redirects file..."
cat > dist/_redirects << EOF
/api/*  /api/index.js  200
/*      /index.html    200
EOF

# Verify the dist directory structure
echo "Files in dist directory:"
ls -la dist/
echo "API directory:"
ls -la dist/api/
echo "Server directory:"
ls -la dist/server/

echo "Build completed successfully!"