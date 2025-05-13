#!/bin/bash

# Run the standard build
npm run build

# Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
touch dist/.nojekyll

# Copy public files to dist directory
cp -r public/* dist/

# Ensure index.html exists for SPA routing
if [ -f dist/index.html ]; then
  # Create a copy for each main route to support direct URL access
  cp dist/index.html dist/404.html
fi

echo "Build completed successfully with public files copied to dist/"