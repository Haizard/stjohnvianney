#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting frontend build process..."

# Navigate to the frontend directory
cd frontend/school-frontend-app

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Set NODE_OPTIONS to avoid potential memory issues
export NODE_OPTIONS="--max-old-space-size=2048"

# Build the frontend
echo "Building frontend..."
npm run build

# Verify the build directory exists
if [ -d "build" ]; then
  echo "Frontend build directory created successfully"
  ls -la build
  
  # Check if index.html exists
  if [ -f "build/index.html" ]; then
    echo "index.html exists"
  else
    echo "ERROR: index.html does not exist!"
    exit 1
  fi
else
  echo "ERROR: Frontend build directory was not created!"
  exit 1
fi

echo "Frontend build completed successfully!"
