#!/bin/bash

# Exit on error
set -e

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Navigate to client directory
cd client

# Build the client
echo "Building the client with Vite..."
npm run build

# Return to root
cd ..

echo "Vercel build complete!"