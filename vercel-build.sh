#!/bin/bash

# Display current directory and files
echo "Current directory: $(pwd)"
echo "Files in root directory:"
ls -la

# Run the Vercel-specific build
echo "Running client Vercel build..."
cd client && npm run vercel-build && cd ..

# Create dist directory if not exists (should match the output in VERCEL_DEPLOYMENT.md)
mkdir -p dist
echo "Copying client build to main dist..."
cp -r client/dist/* dist/

# Create .nojekyll file to prevent GitHub Pages from ignoring files with underscores
echo "Creating .nojekyll file..."
touch dist/.nojekyll

# Copy public files to dist directory
echo "Copying public files to dist directory..."
cp -r public/* dist/

# Create proper 404 page
echo "Creating 404 page..."
cp dist/index.html dist/404.html

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
/*    /index.html   200
EOF

# Verify the dist directory structure
echo "Files in dist directory:"
ls -la dist/

echo "Build completed successfully with proper client files copied to dist/"