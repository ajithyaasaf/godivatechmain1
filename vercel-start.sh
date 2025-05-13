#!/bin/bash

# Ensure environment is set to production
export NODE_ENV=production

# Output some diagnostic information
echo "Starting Vercel serverless function..."
echo "NODE_ENV: $NODE_ENV"
echo "Current directory: $(pwd)"
echo "Files in dist directory:"
ls -la dist/

# Start the serverless function for Vercel
node dist/vercel.js