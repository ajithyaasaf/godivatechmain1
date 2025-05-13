#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm install

# Make sure Firebase is installed in client directory
echo "Ensuring Firebase is installed in client directory..."
cd client && npm install firebase@11.7.1 --no-save && cd ..

# Build the application
npm run build

# Make scripts executable
chmod +x render-start.sh