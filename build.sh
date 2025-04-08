#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies and build
echo "Installing frontend dependencies and building..."
cd frontend/school-frontend-app
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
else
  echo "ERROR: Frontend build directory was not created!"
  exit 1
fi

cd ../..

# Ensure the build directory exists and contains the expected files
echo "Ensuring frontend build files are in the correct location..."

# If we're in the project root, the build directory should be at frontend/school-frontend-app/build
if [ -d "frontend/school-frontend-app/build" ]; then
  echo "Build directory exists at frontend/school-frontend-app/build"
  ls -la frontend/school-frontend-app/build
else
  echo "WARNING: Build directory not found at expected location. Creating it..."
  mkdir -p frontend/school-frontend-app/build

  # Try to find the build directory in other locations
  possible_locations=(
    "./build"
    "frontend/build"
    "frontend/school-frontend-app/build"
  )

  for location in "${possible_locations[@]}"; do
    if [ -d "$location" ] && [ -f "$location/index.html" ]; then
      echo "Found build files at $location, copying to frontend/school-frontend-app/build"
      cp -r "$location"/* frontend/school-frontend-app/build/
      break
    fi
  done
fi

echo "Build completed successfully!"
