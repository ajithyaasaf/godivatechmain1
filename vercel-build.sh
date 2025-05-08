#!/bin/bash

# Build the client
echo "Building the client..."
npm run build

# Compile server code for Vercel
echo "Compiling server code for Vercel..."
npx esbuild server/vercel.js --platform=node --packages=external --bundle --format=esm --outdir=dist