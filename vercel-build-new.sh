#!/bin/bash

# Exit on error
set -e

echo "=== Starting Vercel Build Process ==="

# Step 1: Install root dependencies
echo "Installing root dependencies..."
npm install

# Step 2: Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

# Step 3: Build client application
echo "Building client application..."
cd client
npm run vercel-build
cd ..

echo "=== Vercel Build Process Complete ==="