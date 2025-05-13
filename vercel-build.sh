#!/bin/bash

# Exit on error but allow us to handle it
set -euo pipefail

function handle_error {
  echo "====== BUILD ERROR ======"
  echo "Build failed at line $1"
  echo "Error details: $2"
  echo "========================="
  exit 1
}

# Trap errors with line numbers
trap 'handle_error ${LINENO} "$BASH_COMMAND"' ERR

echo "====== VERCEL BUILD PROCESS ======"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Working directory: $(pwd)"
echo "====================================="

# Verify project structure
echo "Verifying project structure..."
if [ ! -d "client" ]; then
  echo "ERROR: No client directory found in $(pwd)"
  echo "Contents of current directory:"
  ls -la
  exit 1
fi

# Navigate to client directory
cd client
echo "Entering client directory: $(pwd)"

# List files for diagnostic purposes
echo "Client directory contents:"
ls -la

# Verify config files exist
echo "Checking for required config files..."
if [ ! -f "vite.config.vercel.ts" ]; then
  echo "ERROR: vite.config.vercel.ts not found!"
  exit 1
fi

if [ ! -f "vercel-tailwind.config.js" ]; then
  echo "ERROR: vercel-tailwind.config.js not found!"
  exit 1
fi

# Create a copy of theme.json if it doesn't exist in client dir
# This is to ensure consistent theming without relying on dynamic imports
if [ ! -f "theme.json" ] && [ -f "../theme.json" ]; then
  echo "Copying theme.json from parent directory..."
  cp ../theme.json ./theme.json
fi

# Install dependencies with more detailed output
echo "Installing client dependencies..."
npm install --verbose || {
  echo "ERROR: npm install failed"
  exit 1
}

# Build for Vercel
echo "Building client for Vercel..."
npm run vercel-build || {
  echo "ERROR: npm run vercel-build failed"
  exit 1
}

# Verify build output exists
if [ ! -d "dist" ]; then
  echo "ERROR: Build completed but no dist directory was created!"
  exit 1
fi

echo "Checking dist directory contents:"
ls -la dist

echo "Vercel build completed successfully!"