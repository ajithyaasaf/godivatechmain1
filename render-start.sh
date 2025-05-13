#!/bin/bash

# Exit on error
set -e

# Start the server in production mode
NODE_ENV=production node dist/index.js