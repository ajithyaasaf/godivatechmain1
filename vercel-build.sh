#!/bin/bash

# Display current directory and files
echo "Current directory: $(pwd)"
echo "Files in root directory:"
ls -la

# Run the standard build with detailed output
echo "Running npm build..."
npm run build

# Create .nojekyll file to prevent GitHub Pages from ignoring files with underscores
echo "Creating .nojekyll file..."
touch dist/.nojekyll

# Copy public files to dist directory
echo "Copying public files to dist directory..."
cp -r public/* dist/

# Ensure content-type is set correctly
echo "Creating _headers file for content-type..."
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

# Create proper 404 page
echo "Creating 404 page..."
cp dist/index.html dist/404.html

# Verify the dist directory structure
echo "Files in dist directory:"
ls -la dist/

echo "Build completed successfully with public files copied to dist/"