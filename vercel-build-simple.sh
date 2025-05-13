#!/bin/bash

# Exit on errors
set -e

# Print commands for debugging
set -x

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Firebase in client directory
echo "Installing Firebase in client directory..."
cd client && npm install && cd ..

# Build the client and server
echo "Building the application..."
npm run build

# Create necessary directories
echo "Setting up Vercel deployment structure..."
mkdir -p api

# Copy server code to api directory
echo "Setting up API functions..."
cp dist/index.js api/index.js

# Ensure files are in place for Vercel
echo "Verifying deployment files..."
ls -la dist/
ls -la api/

echo "Build completed successfully!"