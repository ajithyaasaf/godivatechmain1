#!/bin/bash

# Install dependencies if not already installed
echo "Installing dependencies..."
npm install

# Make sure Firebase is installed in client directory
echo "Ensuring Firebase is installed in client directory..."
cd client && npm install firebase@11.7.1 --no-save && cd ..

# Build the client
echo "Building the client..."
npm run build

# Make directory structure
echo "Ensuring dist directory is properly structured..."
mkdir -p dist/public

# If this is a monorepo deployment to Vercel, we need to ensure the output directory matches what Vercel expects
# Copy files from dist/public up to dist if needed
if [ -d "dist/public" ]; then
  echo "Copying built files to root dist directory for Vercel compatibility..."
  cp -r dist/public/* dist/
fi

# Compile server code for Vercel
echo "Compiling server code for Vercel..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist