#!/bin/bash

# Build the client
echo "Building the client with Vite..."
npx vite build

# Ensure the client build artifacts are in the right place
echo "Ensuring client build artifacts are in the right place..."
mkdir -p dist/client
cp -r client/dist/* dist/client/

# Build the server
echo "Building the server..."
npx esbuild server/vercel-simplified.js --platform=node --packages=external --bundle --format=esm --outdir=dist/server

echo "Build complete!"