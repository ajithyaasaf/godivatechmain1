#!/bin/bash

# Exit on error
set -e

# Install dependencies
npm ci

# Build the application
npm run build

# Make scripts executable
chmod +x render-start.sh