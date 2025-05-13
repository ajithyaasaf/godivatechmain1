#!/bin/bash

# Exit on error
set -e

echo "Starting Vercel build process..."

# Navigate to client directory
cd client

# Install dependencies
echo "Installing client dependencies..."
npm install

# Build for Vercel
echo "Building client for Vercel..."
npm run vercel-build

echo "Vercel build completed successfully!"