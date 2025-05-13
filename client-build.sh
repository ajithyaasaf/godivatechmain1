#!/bin/bash

# Exit on error
set -e

# Navigate to client directory
cd client

# Install dependencies
echo "Installing client dependencies..."
npm install

# Build the frontend
echo "Building frontend..."
npm run build

# Output build information
echo "Build complete! The 'client/dist' directory is ready for deployment."
echo "For Vercel deployment, push your code to GitHub and connect your repository to Vercel."
echo "Make sure to set the root directory to 'client' in the Vercel project settings."