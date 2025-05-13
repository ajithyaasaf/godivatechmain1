#!/bin/bash

# Run the standard build
npm run build

# Copy public files to dist directory
cp -r public/* dist/

echo "Build completed successfully with public files copied to dist/"