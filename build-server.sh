#!/bin/bash
# Build script for Render deployment (backend only)

echo "Building server for production..."

# Install dependencies
npm install

# Build the server
echo "Compiling server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Server build complete!"